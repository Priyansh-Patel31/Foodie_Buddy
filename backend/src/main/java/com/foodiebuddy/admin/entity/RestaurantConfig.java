package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "restaurant_config")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RestaurantConfig {

    @Id
    private String id;

    private String name;

    private String address;

    private String phone;

    // Vaishnodevi Circle, Ahmedabad coordinates
    private Double latitude;
    private Double longitude;

    private String openingTime; // e.g., "09:00"
    private String closingTime; // e.g., "23:00"

    // Delivery pricing config
    private Double freeDeliveryRadiusKm; // Default 1.5
    private Double baseDeliveryFee;       // Default 20.0
    private Double perKmDeliveryFee;      // Default 10.0

    public static RestaurantConfig defaultConfig() {
        return RestaurantConfig.builder()
                .name("Foodie Buddy Restaurant")
                .address("Vaishnodevi Circle, SG Highway, Ahmedabad, Gujarat 382481")
                .phone("+91-79-12345678")
                .latitude(23.0735)
                .longitude(72.5146)
                .openingTime("09:00")
                .closingTime("23:00")
                .freeDeliveryRadiusKm(1.5)
                .baseDeliveryFee(20.0)
                .perKmDeliveryFee(10.0)
                .build();
    }
}
