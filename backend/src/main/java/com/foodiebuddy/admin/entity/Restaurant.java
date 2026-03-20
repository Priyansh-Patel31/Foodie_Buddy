package com.foodiebuddy.admin.entity;

import com.foodiebuddy.admin.entity.enums.RestaurantStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "restaurants")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Restaurant {

    @Id
    private String id;

    private String name;

    private String ownerName;

    private String email;

    private String phone;

    private String location;

    private Double latitude;

    private Double longitude;

    private RestaurantStatus status;

    private Double commissionRate;

    private LocalDateTime createdAt;

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = RestaurantStatus.PENDING;
        if (this.commissionRate == null) this.commissionRate = 10.0;
    }
}
