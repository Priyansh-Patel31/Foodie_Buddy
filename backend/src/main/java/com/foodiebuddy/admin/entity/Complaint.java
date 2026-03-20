package com.foodiebuddy.admin.entity;

import com.foodiebuddy.admin.entity.enums.ComplaintStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "complaints")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Complaint {

    @Id
    private String id;

    @DocumentReference(lazy = true)
    private User user;

    @DocumentReference(lazy = true)
    private Order order;

    private String description;

    private ComplaintStatus status;

    private LocalDateTime createdAt;

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = ComplaintStatus.OPEN;
    }
}
