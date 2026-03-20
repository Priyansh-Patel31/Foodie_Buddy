package com.foodiebuddy.admin.entity;

import com.foodiebuddy.admin.entity.enums.OrderStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id
    private String id;

    @DocumentReference(lazy = true)
    private User user;

    @DocumentReference(lazy = true)
    private Restaurant restaurant;

    private BigDecimal totalAmount;

    private Double distanceKm;

    private BigDecimal commissionAmount;

    private BigDecimal platformRevenue;

    private BigDecimal restaurantRevenue;

    private OrderStatus status;

    private LocalDateTime createdAt;

    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = OrderStatus.PLACED;
    }
}
