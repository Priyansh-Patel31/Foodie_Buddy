package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.OrderDTO;
import com.foodiebuddy.admin.dto.PlaceOrderRequest;
import com.foodiebuddy.admin.entity.*;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
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
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

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

        // Build order items and calculate subtotal
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (PlaceOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + itemReq.getMenuItemId()));

            if (!Boolean.TRUE.equals(menuItem.getIsAvailable())) {
                throw new BadRequestException("Menu item not available: " + menuItem.getName());
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

            // Auto-deduct inventory
            inventoryService.deductForMenuItem(menuItem, itemReq.getQuantity());
        }

        // Calculate delivery fee
        double distance = deliveryFeeService.calculateDistance(
                request.getCustomerLatitude(), request.getCustomerLongitude());
        distance = Math.round(distance * 10.0) / 10.0;
        BigDecimal deliveryFee = deliveryFeeService.calculateDeliveryFee(distance);

        // Total = subtotal + deliveryFee (no tax)
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
        log.info("Order placed: {} by {} — Total: ₹{}", savedOrder.getId(), customer.getName(), totalAmount);

        // Notify via WebSocket
        notificationService.notifyNewOrder(savedOrder);

        return toDTO(savedOrder);
    }

    public OrderDTO updateStatus(String orderId, OrderStatus newStatus) {
        Order order = findById(orderId);
        order.setStatus(newStatus);

        switch (newStatus) {
            case PLACED -> {}
            case CONFIRMED -> order.setConfirmedAt(LocalDateTime.now());
            case PREPARING -> order.setPreparingAt(LocalDateTime.now());
            case READY -> order.setReadyAt(LocalDateTime.now());
            case OUT_FOR_DELIVERY -> {}
            case PICKED_UP -> order.setPickedUpAt(LocalDateTime.now());
            case DELIVERED -> order.setDeliveredAt(LocalDateTime.now());
            case CANCELLED -> order.setCancelledAt(LocalDateTime.now());
        }

        Order saved = orderRepository.save(order);
        notificationService.notifyOrderUpdate(saved);
        return toDTO(saved);
    }

    public OrderDTO assignDelivery(String orderId, String deliveryUserId) {
        Order order = findById(orderId);
        User deliveryUser = userRepository.findById(deliveryUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery user not found"));

        order.setAssignedDeliveryUserId(deliveryUser.getId());
        order.setAssignedDeliveryUserName(deliveryUser.getName());
        Order saved = orderRepository.save(order);
        return toDTO(saved);
    }

    public OrderDTO assignChef(String orderId, String chefUserId) {
        Order order = findById(orderId);
        User chef = userRepository.findById(chefUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Chef user not found"));

        order.setAssignedChefId(chef.getId());
        order.setAssignedChefUserName(chef.getName());
        Order saved = orderRepository.save(order);
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

        // Update driver rating
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

        // Update food rating
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
        return orderRepository.findByCustomerId(customerId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getAll() {
        return orderRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getActiveOrders() {
        return orderRepository.findActiveOrders().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getKitchenOrders() {
        List<OrderStatus> kitchenStatuses = List.of(OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING);
        return orderRepository.findByStatusIn(kitchenStatuses).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getKitchenOrdersForChef(String chefId) {
        List<OrderStatus> kitchenStatuses = List.of(OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY);
        return orderRepository.findByStatusIn(kitchenStatuses).stream()
                .filter(o -> chefId.equals(o.getAssignedChefId()))
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getDeliveryOrders(String deliveryUserId) {
        return orderRepository.findByAssignedDeliveryUserId(deliveryUserId).stream()
                .filter(o -> o.getStatus() == OrderStatus.READY || o.getStatus() == OrderStatus.PICKED_UP || o.getStatus() == OrderStatus.OUT_FOR_DELIVERY)
                .map(this::toDTO).collect(Collectors.toList());
    }

    public OrderDTO getById(String id) {
        return toDTO(findById(id));
    }

    private Order findById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    private OrderDTO toDTO(Order o) {
        List<OrderDTO.OrderItemDTO> itemDTOs = o.getItems() != null
                ? o.getItems().stream().map(item -> OrderDTO.OrderItemDTO.builder()
                    .menuItemId(item.getMenuItemId())
                    .menuItemName(item.getMenuItemName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getTotalPrice())
                    .build()).collect(Collectors.toList())
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
                .status(o.getStatus().name())
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
