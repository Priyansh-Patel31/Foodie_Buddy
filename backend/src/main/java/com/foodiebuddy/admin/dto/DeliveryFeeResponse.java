package com.foodiebuddy.admin.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryFeeResponse {
    private Double distanceKm;
    private BigDecimal deliveryFee;
    private Boolean isFreeDelivery;
    private String message;
}
