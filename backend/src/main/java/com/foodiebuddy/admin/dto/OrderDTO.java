package com.foodiebuddy.admin.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderDTO {
    private String id;
    private String customerId;
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal totalAmount;
    private Double distanceKm;
    private String status;
    private String assignedChefId;
    private String assignedChefUserName;
    private String assignedDeliveryUserId;
    private String assignedDeliveryUserName;
    private String managingManagerId;
    private String managingManagerName;
    private BigDecimal customerCharge;
    private BigDecimal calculatedProfit;
    private LocalDateTime createdAt;
    
    // Rating Fields
    private Boolean isRated;
    private Integer deliveryRating;
    private Integer foodRating;
    
    private List<OrderItemDTO> items;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderItemDTO {
        private String menuItemId;
        private String menuItemName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
    }
}
