package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import lombok.*;
import java.math.BigDecimal;

@Document(collection = "menu_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItem {

    @Id
    private String id;

    private String name;

    private String description;

    private BigDecimal price;

    @DocumentReference(lazy = true)
    private Restaurant restaurant;

    @DocumentReference(lazy = true)
    private Category category;
}
