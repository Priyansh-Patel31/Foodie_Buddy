package com.foodiebuddy.admin.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RestaurantDTO {
    private String id;
    private String name;
    private String ownerName;
    private String email;
    private String phone;
    private String location;
    private Double latitude;
    private Double longitude;
    private String status;
    private Double commissionRate;
    private LocalDateTime createdAt;
}
