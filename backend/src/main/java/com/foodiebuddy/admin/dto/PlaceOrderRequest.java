package com.foodiebuddy.admin.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlaceOrderRequest {
    private List<OrderItemRequest> items;
    private Double customerLatitude;
    private Double customerLongitude;
    private String customerAddress;
    private String customerPhone;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderItemRequest {
        private String menuItemId;
        private Integer quantity;
    }
}
