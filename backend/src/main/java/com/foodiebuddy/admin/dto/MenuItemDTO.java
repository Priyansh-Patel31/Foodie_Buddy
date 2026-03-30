package com.foodiebuddy.admin.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItemDTO {
    private String id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private String categoryId;
    private String categoryName;
    private Boolean isAvailable;
    private Boolean isVegetarian;
}
