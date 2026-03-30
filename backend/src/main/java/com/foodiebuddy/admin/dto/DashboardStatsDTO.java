package com.foodiebuddy.admin.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsDTO {
    private long totalOrders;
    private long activeOrders;
    private long totalCustomers;
    private long totalStaff;
    private double totalRevenue;
    private long pendingOrders;
    private long lowStockItems;
    private long pendingTasks;
}
