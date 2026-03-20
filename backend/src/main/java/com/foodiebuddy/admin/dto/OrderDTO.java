package com.foodiebuddy.admin.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderDTO {
    private String id;
    private String userId;
    private String userName;
    private String restaurantId;
    private String restaurantName;
    private BigDecimal totalAmount;
    private Double distanceKm;
    private BigDecimal commissionAmount;
    private BigDecimal platformRevenue;
    private BigDecimal restaurantRevenue;
    private String status;
    private LocalDateTime createdAt;
}
