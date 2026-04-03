package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.OrderDTO;
import com.foodiebuddy.admin.dto.PlaceOrderRequest;
import com.foodiebuddy.admin.entity.MenuItem;
import com.foodiebuddy.admin.entity.Order;
import com.foodiebuddy.admin.entity.OrderItem;
import com.foodiebuddy.admin.entity.User;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
import com.foodiebuddy.admin.entity.enums.Role;
import com.foodiebuddy.admin.exception.BadRequestException;
import com.foodiebuddy.admin.exception.ResourceNotFoundException;
import com.foodiebuddy.admin.repository.MenuItemRepository;
import com.foodiebuddy.admin.repository.OrderRepository;
import com.foodiebuddy.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private static final Set<OrderStatus> TERMINAL_STATUSES = Set.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED);
    private static final Comparator<Order> ORDER_BY_CREATED_AT_DESC = Comparator
            .comparing((Order o) -> o.getCreatedAt() != null ? o.getCreatedAt() : LocalDateTime.MIN)
            .reversed();

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final DeliveryFeeService deliveryFeeService;
    private final InventoryService inventoryService;
    private final WebSocketNotificationService notificationService;

    public OrderDTO placeOrder(PlaceOrderRequest request, String customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must have at least one item");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (PlaceOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new BadRequestException("Order item quantity must be greater than zero");
            }

            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + itemReq.getMenuItemId()));

            if (!Boolean.TRUE.equals(menuItem.getIsAvailable())) {
                throw new BadRequestException("Menu item not available: " + menuItem.getName());
            }

            if (menuItem.getPrice() == null) {
                throw new BadRequestException("Menu item price is missing: " + menuItem.getName());
            }

            BigDecimal itemTotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .menuItemId(menuItem.getId())
                    .menuItemName(menuItem.getName())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(menuItem.getPrice())
                    .totalPrice(itemTotal)
                    .build();

            orderItems.add(orderItem);
            subtotal = subtotal.add(itemTotal);

            inventoryService.deductForMenuItem(menuItem, itemReq.getQuantity());
        }

        Double customerLat = request.getCustomerLatitude();
        Double customerLng = request.getCustomerLongitude();
        double distance;
        BigDecimal deliveryFee;

        if (customerLat != null && customerLng != null) {
            distance = deliveryFeeService.calculateDistance(customerLat, customerLng);
            distance = Math.round(distance * 10.0) / 10.0;
            deliveryFee = deliveryFeeService.calculateDeliveryFee(distance);
        } else {
            distance = 0.0;
            deliveryFee = BigDecimal.ZERO;
        }

        BigDecimal totalAmount = subtotal.add(deliveryFee);

        Order order = Order.builder()
                .customerId(customer.getId())
                .customerName(customer.getName())
                .customerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone() : customer.getPhone())
                .customerLatitude(request.getCustomerLatitude())
                .customerLongitude(request.getCustomerLongitude())
                .customerAddress(request.getCustomerAddress())
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .totalAmount(totalAmount)
                .distanceKm(distance)
                .items(orderItems)
                .status(OrderStatus.PLACED)
                .build();
        order.onCreate();

        Order savedOrder = orderRepository.save(order);
        log.info("Order placed: {} by {} - Total: {}", savedOrder.getId(), customer.getName(), totalAmount);

        safeNotifyNewOrder(savedOrder);
        return toDTO(savedOrder);
    }

    public OrderDTO updateStatus(String orderId, OrderStatus newStatus) {
        Order order = findById(orderId);
        validateTransition(order, newStatus);
        return applyAndPersistStatus(order, newStatus);
    }

    public OrderDTO startCooking(String orderId, String chefUserId) {
        Order order = findById(orderId);
        validateChefOwnership(order, chefUserId);
        validateTransition(order, OrderStatus.PREPARING);
        return applyAndPersistStatus(order, OrderStatus.PREPARING);
    }

    public OrderDTO markReady(String orderId, String chefUserId) {
        Order order = findById(orderId);
        validateChefOwnership(order, chefUserId);
        validateTransition(order, OrderStatus.READY);
        return applyAndPersistStatus(order, OrderStatus.READY);
    }

    public OrderDTO pickupOrder(String orderId, String deliveryUserId) {
        Order order = findById(orderId);
        validateDeliveryOwnership(order, deliveryUserId);
        validateTransition(order, OrderStatus.PICKED_UP);
        return applyAndPersistStatus(order, OrderStatus.PICKED_UP);
    }

    public OrderDTO startDelivery(String orderId, String deliveryUserId) {
        Order order = findById(orderId);
        validateDeliveryOwnership(order, deliveryUserId);
        validateTransition(order, OrderStatus.OUT_FOR_DELIVERY);
        return applyAndPersistStatus(order, OrderStatus.OUT_FOR_DELIVERY);
    }

    public OrderDTO completeDelivery(String orderId, String deliveryUserId) {
        Order order = findById(orderId);
        validateDeliveryOwnership(order, deliveryUserId);
        validateTransition(order, OrderStatus.DELIVERED);
        return applyAndPersistStatus(order, OrderStatus.DELIVERED);
    }

    public OrderDTO assignDelivery(String orderId, String deliveryUserId) {
        Order order = findById(orderId);
        User deliveryUser = userRepository.findById(deliveryUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery user not found"));

        if (deliveryUser.getRole() != Role.ROLE_DELIVERY) {
            throw new BadRequestException("Selected user is not a delivery partner");
        }

        order.setAssignedDeliveryUserId(deliveryUser.getId());
        order.setAssignedDeliveryUserName(deliveryUser.getName());
        Order saved = orderRepository.save(order);
        safeNotifyOrderUpdate(saved);
        return toDTO(saved);
    }

    public OrderDTO assignChef(String orderId, String chefUserId) {
        Order order = findById(orderId);
        User chef = userRepository.findById(chefUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Chef user not found"));

        if (chef.getRole() != Role.ROLE_CHEF) {
            throw new BadRequestException("Selected user is not a chef");
        }

        order.setAssignedChefId(chef.getId());
        order.setAssignedChefUserName(chef.getName());
        Order saved = orderRepository.save(order);
        safeNotifyOrderUpdate(saved);
        return toDTO(saved);
    }

    public OrderDTO rateOrder(String orderId, com.foodiebuddy.admin.dto.RatingRequest request) {
        Order order = findById(orderId);
        if (Boolean.TRUE.equals(order.getIsRated())) {
            throw new BadRequestException("Order is already rated");
        }

        order.setIsRated(true);
        order.setDeliveryRating(request.getDeliveryRating());
        order.setFoodRating(request.getFoodRating());

        if (order.getAssignedDeliveryUserId() != null && request.getDeliveryRating() != null) {
            userRepository.findById(order.getAssignedDeliveryUserId()).ifPresent(driver -> {
                int count = driver.getRatingCount() != null ? driver.getRatingCount() : 0;
                double currentAvg = driver.getAverageRating() != null ? driver.getAverageRating() : 0.0;
                double newAvg = ((currentAvg * count) + request.getDeliveryRating()) / (count + 1);
                driver.setAverageRating(Math.round(newAvg * 10.0) / 10.0);
                driver.setRatingCount(count + 1);
                userRepository.save(driver);
            });
        }

        if (order.getItems() != null && request.getFoodRating() != null) {
            for (OrderItem item : order.getItems()) {
                menuItemRepository.findById(item.getMenuItemId()).ifPresent(menuItem -> {
                    int count = menuItem.getRatingCount() != null ? menuItem.getRatingCount() : 0;
                    double currentAvg = menuItem.getAverageRating() != null ? menuItem.getAverageRating() : 0.0;
                    double newAvg = ((currentAvg * count) + request.getFoodRating()) / (count + 1);
                    menuItem.setAverageRating(Math.round(newAvg * 10.0) / 10.0);
                    menuItem.setRatingCount(count + 1);
                    menuItemRepository.save(menuItem);
                });
            }
        }

        Order saved = orderRepository.save(order);
        return toDTO(saved);
    }

    public List<OrderDTO> getByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .sorted(ORDER_BY_CREATED_AT_DESC)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAll() {
        return orderRepository.findAll().stream()
                .sorted(ORDER_BY_CREATED_AT_DESC)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .sorted(ORDER_BY_CREATED_AT_DESC)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getActiveOrders() {
        return orderRepository.findActiveOrders().stream()
                .sorted(ORDER_BY_CREATED_AT_DESC)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getKitchenOrders() {
        List<OrderStatus> kitchenStatuses = List.of(OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING);
        return orderRepository.findByStatusIn(kitchenStatuses).stream()
                .sorted(ORDER_BY_CREATED_AT_DESC)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getKitchenOrdersForChef(String chefId) {
        List<OrderStatus> kitchenStatuses = List.of(OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY);
        return orderRepository.findByStatusIn(kitchenStatuses).stream()
                .filter(o -> Objects.equals(chefId, o.getAssignedChefId()))
                .sorted(ORDER_BY_CREATED_AT_DESC)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getDeliveryOrders(String deliveryUserId) {
        return orderRepository.findByAssignedDeliveryUserId(deliveryUserId).stream()
                .filter(o -> o.getStatus() == OrderStatus.READY || o.getStatus() == OrderStatus.PICKED_UP || o.getStatus() == OrderStatus.OUT_FOR_DELIVERY)
                .sorted(ORDER_BY_CREATED_AT_DESC)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getById(String id) {
        return toDTO(findById(id));
    }

    private Order findById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    private OrderDTO applyAndPersistStatus(Order order, OrderStatus newStatus) {
        if (order.getStatus() == newStatus) {
            return toDTO(order);
        }

        order.setStatus(newStatus);
        LocalDateTime now = LocalDateTime.now();

        switch (newStatus) {
            case PLACED -> {
                // no-op
            }
            case CONFIRMED -> {
                if (order.getConfirmedAt() == null) order.setConfirmedAt(now);
            }
            case PREPARING -> {
                if (order.getPreparingAt() == null) order.setPreparingAt(now);
            }
            case READY -> {
                if (order.getReadyAt() == null) order.setReadyAt(now);
            }
            case OUT_FOR_DELIVERY -> {
                if (order.getPickedUpAt() == null) order.setPickedUpAt(now);
            }
            case PICKED_UP -> order.setPickedUpAt(now);
            case DELIVERED -> {
                if (order.getDeliveredAt() == null) order.setDeliveredAt(now);
            }
            case CANCELLED -> {
                if (order.getCancelledAt() == null) order.setCancelledAt(now);
            }
        }

        Order saved = orderRepository.save(order);
        safeNotifyOrderUpdate(saved);
        return toDTO(saved);
    }

    private void validateTransition(Order order, OrderStatus newStatus) {
        if (newStatus == null) {
            throw new BadRequestException("Order status is required");
        }

        OrderStatus currentStatus = order.getStatus();
        if (currentStatus == null || currentStatus == newStatus) {
            return;
        }

        if (TERMINAL_STATUSES.contains(currentStatus)) {
            throw new BadRequestException("Cannot change status of a " + currentStatus.name().toLowerCase() + " order");
        }

        if (newStatus == OrderStatus.CANCELLED) {
            return;
        }

        boolean allowed = switch (currentStatus) {
            case PLACED -> newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.PREPARING;
            case CONFIRMED -> newStatus == OrderStatus.PREPARING;
            case PREPARING -> newStatus == OrderStatus.READY;
            case READY -> newStatus == OrderStatus.PICKED_UP || newStatus == OrderStatus.OUT_FOR_DELIVERY;
            case PICKED_UP -> newStatus == OrderStatus.OUT_FOR_DELIVERY || newStatus == OrderStatus.DELIVERED;
            case OUT_FOR_DELIVERY -> newStatus == OrderStatus.DELIVERED;
            case DELIVERED, CANCELLED -> false;
        };

        if (!allowed) {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
    }

    private void validateChefOwnership(Order order, String chefUserId) {
        if (!hasText(chefUserId)) {
            throw new BadRequestException("Chef identity is missing");
        }
        if (!hasText(order.getAssignedChefId())) {
            throw new BadRequestException("Order is not assigned to a chef yet");
        }
        if (!chefUserId.equals(order.getAssignedChefId())) {
            throw new BadRequestException("This order is assigned to another chef");
        }
    }

    private void validateDeliveryOwnership(Order order, String deliveryUserId) {
        if (!hasText(deliveryUserId)) {
            throw new BadRequestException("Delivery identity is missing");
        }
        if (!hasText(order.getAssignedDeliveryUserId())) {
            throw new BadRequestException("Order is not assigned to a delivery partner yet");
        }
        if (!deliveryUserId.equals(order.getAssignedDeliveryUserId())) {
            throw new BadRequestException("This order is assigned to another delivery partner");
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private void safeNotifyNewOrder(Order order) {
        try {
            notificationService.notifyNewOrder(order);
        } catch (Exception ex) {
            log.error("Failed to publish new-order notification for order {}", order != null ? order.getId() : "unknown", ex);
        }
    }

    private void safeNotifyOrderUpdate(Order order) {
        try {
            notificationService.notifyOrderUpdate(order);
        } catch (Exception ex) {
            log.error("Failed to publish order-update notification for order {}", order != null ? order.getId() : "unknown", ex);
        }
    }

    private OrderDTO toDTO(Order o) {
        List<OrderDTO.OrderItemDTO> itemDTOs = o.getItems() != null
                ? o.getItems().stream()
                .filter(Objects::nonNull)
                .map(item -> OrderDTO.OrderItemDTO.builder()
                        .menuItemId(item.getMenuItemId())
                        .menuItemName(item.getMenuItemName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList())
                : new ArrayList<>();

        return OrderDTO.builder()
                .id(o.getId())
                .customerId(o.getCustomerId())
                .customerName(o.getCustomerName())
                .customerPhone(o.getCustomerPhone())
                .customerAddress(o.getCustomerAddress())
                .subtotal(o.getSubtotal())
                .deliveryFee(o.getDeliveryFee())
                .totalAmount(o.getTotalAmount())
                .distanceKm(o.getDistanceKm())
                .status(o.getStatus() != null ? o.getStatus().name() : OrderStatus.PLACED.name())
                .assignedChefId(o.getAssignedChefId())
                .assignedChefUserName(o.getAssignedChefUserName())
                .assignedDeliveryUserId(o.getAssignedDeliveryUserId())
                .assignedDeliveryUserName(o.getAssignedDeliveryUserName())
                .managingManagerId(o.getManagingManagerId())
                .managingManagerName(o.getManagingManagerName())
                .customerCharge(o.getCustomerCharge())
                .calculatedProfit(o.getCalculatedProfit())
                .createdAt(o.getCreatedAt())
                .isRated(o.getIsRated())
                .deliveryRating(o.getDeliveryRating())
                .foodRating(o.getFoodRating())
                .items(itemDTOs)
                .build();
    }
}
