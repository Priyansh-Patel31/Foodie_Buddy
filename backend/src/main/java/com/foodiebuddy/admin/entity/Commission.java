package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "commissions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Commission {

    @Id
    private String id;

    @DocumentReference(lazy = true)
    private Order order;

    @DocumentReference(lazy = true)
    private Restaurant restaurant;

    private BigDecimal amount;

    private Boolean waived;

    private LocalDateTime createdAt;

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.waived == null) this.waived = false;
    }
}
