package com.foodiebuddy.admin.dto;

import lombok.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingRequest {
    @Min(value = 1, message = "Food rating must be between 1 and 5")
    @Max(value = 5, message = "Food rating must be between 1 and 5")
    private Integer foodRating;
    @Min(value = 1, message = "Delivery rating must be between 1 and 5")
    @Max(value = 5, message = "Delivery rating must be between 1 and 5")
    private Integer deliveryRating;
}
