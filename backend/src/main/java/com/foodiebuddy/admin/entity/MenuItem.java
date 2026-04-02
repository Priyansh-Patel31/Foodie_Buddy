package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "menu_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItem {

    @Id
    private String id;

    private String name;

    private String description;

    private BigDecimal price;

    private String imageUrl;

    private String categoryId;
    private String categoryName;

    private Boolean isAvailable;

    private Boolean isVegetarian;

    // Ingredient references for auto inventory deduction
    // Each entry: { ingredientId: "xxx", quantityRequired: 1.0 }
    @Builder.Default
    private List<IngredientRequirement> ingredients = new ArrayList<>();

    // Rating System Fields
    private Double averageRating;
    private Integer ratingCount;

    public void onCreate() {
        if (this.isAvailable == null) this.isAvailable = true;
        if (this.isVegetarian == null) this.isVegetarian = false;
        if (this.ratingCount == null) this.ratingCount = 0;
        if (this.averageRating == null) this.averageRating = 0.0;
    }
}
