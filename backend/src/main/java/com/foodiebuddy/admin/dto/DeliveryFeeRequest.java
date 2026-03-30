package com.foodiebuddy.admin.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryFeeRequest {
    private Double customerLatitude;
    private Double customerLongitude;
}
