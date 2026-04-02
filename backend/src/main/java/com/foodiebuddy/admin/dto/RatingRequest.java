package com.foodiebuddy.admin.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingRequest {
    private Integer foodRating;
    private Integer deliveryRating;
}
