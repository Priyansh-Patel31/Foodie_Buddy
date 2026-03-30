package com.foodiebuddy.admin.entity;

import com.foodiebuddy.admin.entity.enums.OrderStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
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

    private String customerId;
    private String customerName;
    private String customerPhone;

    // Customer delivery location
    private Double customerLatitude;
    private Double customerLongitude;
    private String customerAddress;

    // Price breakdown (no tax)
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal totalAmount;

    // Distance from restaurant
    private Double distanceKm;

    private OrderStatus status;

    // Staff assignments
    private String assignedChefId;
    private String assignedChefUserName;
    private String assignedDeliveryUserId;
    private String assignedDeliveryUserName;
    private String managingManagerId;
    private String managingManagerName;

    // Advanced Financial Tracking
    private BigDecimal customerCharge;
    private BigDecimal calculatedProfit;

    // Proof of delivery
    private String proofOfDeliveryUrl;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime preparingAt;
    private LocalDateTime readyAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;

    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = OrderStatus.PLACED;
    }
}
