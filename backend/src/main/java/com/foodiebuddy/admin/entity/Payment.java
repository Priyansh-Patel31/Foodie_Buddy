package com.foodiebuddy.admin.entity;

import com.foodiebuddy.admin.entity.enums.PaymentStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {

    @Id
    private String id;

    @DocumentReference(lazy = true)
    private Order order;

    private BigDecimal amount;

    private String method;

    private PaymentStatus status;

    private LocalDateTime createdAt;

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = PaymentStatus.PENDING;
    }
}
