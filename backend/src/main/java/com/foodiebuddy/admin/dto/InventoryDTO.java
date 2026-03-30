package com.foodiebuddy.admin.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryDTO {
    private String id;
    private String name;
    private String unit;
    private Double currentStock;
    private Double lowStockThreshold;
    private Boolean isLowStock;
    private String lastRestockedAt;
}
