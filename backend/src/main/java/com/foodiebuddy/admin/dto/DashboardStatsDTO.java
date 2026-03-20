package com.foodiebuddy.admin.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsDTO {
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long totalRestaurants;
    private long totalUsers;
    private long todaysOrders;
    private long pendingApprovals;
    private long activeRestaurants;
    private long openComplaints;
}
