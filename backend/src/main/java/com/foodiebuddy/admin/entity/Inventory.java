package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "inventory")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Inventory {

    @Id
    private String id;

    private String name;

    private String unit; // e.g., "kg", "liters", "pieces", "packets"

    private Double currentStock;

    private Double lowStockThreshold;

    private LocalDateTime lastRestockedAt;

    private LocalDateTime createdAt;

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.currentStock == null) this.currentStock = 0.0;
        if (this.lowStockThreshold == null) this.lowStockThreshold = 5.0;
    }

    public boolean isLowStock() {
        return this.currentStock != null && this.lowStockThreshold != null
                && this.currentStock <= this.lowStockThreshold;
    }
}
