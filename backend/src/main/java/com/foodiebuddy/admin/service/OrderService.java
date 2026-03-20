package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.OrderDTO;
import com.foodiebuddy.admin.entity.Order;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
import com.foodiebuddy.admin.exception.ResourceNotFoundException;
import com.foodiebuddy.admin.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public Page<OrderDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::toDTO);
    }

    public Page<OrderDTO> getByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable).map(this::toDTO);
    }

    public Page<OrderDTO> getByRestaurant(String restaurantId, Pageable pageable) {
        return orderRepository.findByRestaurantId(restaurantId, pageable).map(this::toDTO);
    }

    public Page<OrderDTO> getByUser(String userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable).map(this::toDTO);
    }

    public Page<OrderDTO> getByDateRange(LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return orderRepository.findByDateRange(start, end, pageable).map(this::toDTO);
    }

    public OrderDTO getById(String id) {
        return toDTO(findById(id));
    }

    /**
     * Calculate commission based on the 2km rule:
     * - If distance <= 2km: commission = 0, platform revenue = 0
     * - Otherwise: commission = totalAmount * commissionRate / 100
     */
    public static BigDecimal[] calculateCommission(BigDecimal totalAmount, Double distanceKm, Double commissionRate) {
        BigDecimal commissionAmount;
        BigDecimal platformRevenue;
        BigDecimal restaurantRevenue;

        if (distanceKm != null && distanceKm <= 2.0) {
            commissionAmount = BigDecimal.ZERO;
            platformRevenue = BigDecimal.ZERO;
            restaurantRevenue = totalAmount;
        } else {
            commissionAmount = totalAmount.multiply(BigDecimal.valueOf(commissionRate))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            platformRevenue = commissionAmount;
            restaurantRevenue = totalAmount.subtract(commissionAmount);
        }

        return new BigDecimal[]{commissionAmount, platformRevenue, restaurantRevenue};
    }

    private Order findById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    private OrderDTO toDTO(Order o) {
        return OrderDTO.builder()
                .id(o.getId())
                .userId(o.getUser().getId())
                .userName(o.getUser().getName())
                .restaurantId(o.getRestaurant().getId())
                .restaurantName(o.getRestaurant().getName())
                .totalAmount(o.getTotalAmount())
                .distanceKm(o.getDistanceKm())
                .commissionAmount(o.getCommissionAmount())
                .platformRevenue(o.getPlatformRevenue())
                .restaurantRevenue(o.getRestaurantRevenue())
                .status(o.getStatus().name())
                .createdAt(o.getCreatedAt())
                .build();
    }
}
