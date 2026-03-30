package com.foodiebuddy.admin.entity;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IngredientRequirement {
    private String inventoryItemId;
    private String inventoryItemName;
    private Double quantityRequired;
}
