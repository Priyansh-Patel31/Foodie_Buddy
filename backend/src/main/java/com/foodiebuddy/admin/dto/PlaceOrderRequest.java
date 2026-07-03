package com.foodiebuddy.admin.dto;

import lombok.*;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlaceOrderRequest {
    @NotEmpty(message = "Add at least one item to the order")
    @Valid
    private List<OrderItemRequest> items;
    @NotNull(message = "Customer latitude is required")
    @DecimalMin("-90.0") @DecimalMax("90.0")
    private Double customerLatitude;
    @NotNull(message = "Customer longitude is required")
    @DecimalMin("-180.0") @DecimalMax("180.0")
    private Double customerLongitude;
    @NotBlank(message = "Delivery address is required")
    private String customerAddress;
    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderItemRequest {
        @NotBlank(message = "Menu item is required")
        private String menuItemId;
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        @Max(value = 100, message = "Quantity must not exceed 100")
        private Integer quantity;
    }
}
