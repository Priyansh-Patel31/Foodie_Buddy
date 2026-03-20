package com.foodiebuddy.admin.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RevenueStatsDTO {
    private BigDecimal totalPlatformRevenue;
    private BigDecimal totalRestaurantRevenue;
    private BigDecimal totalCommissionCollected;
    private BigDecimal totalCommissionWaived;
    private BigDecimal totalOrderValue;
}
