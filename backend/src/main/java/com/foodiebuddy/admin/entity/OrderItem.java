package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {

    @Id
    private String id;

    @DocumentReference(lazy = true)
    private MenuItem menuItem;

    private Integer quantity;

    private BigDecimal price;
}
