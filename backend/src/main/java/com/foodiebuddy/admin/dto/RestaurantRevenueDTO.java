package com.foodiebuddy.admin.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RestaurantRevenueDTO {
    private String restaurantId;
    private String restaurantName;
    private long orderCount;
    private BigDecimal totalRevenue;
    private BigDecimal platformRevenue;
}
