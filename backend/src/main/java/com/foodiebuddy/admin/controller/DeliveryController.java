package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.*;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
import com.foodiebuddy.admin.security.JwtTokenProvider;
import com.foodiebuddy.admin.service.DeliveryFeeService;
import com.foodiebuddy.admin.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Delivery", description = "Delivery APIs")
public class DeliveryController {

    private final DeliveryFeeService deliveryFeeService;
    private final OrderService orderService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/api/delivery/fee")
    @Operation(summary = "Calculate delivery fee (Public)")
    public ResponseEntity<ApiResponse<DeliveryFeeResponse>> calculateFee(@RequestBody DeliveryFeeRequest request) {
        DeliveryFeeResponse response = deliveryFeeService.calculateFee(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/api/delivery/my-orders")
    @Operation(summary = "Get assigned delivery orders (Delivery Guy)")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getMyDeliveries(HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(ApiResponse.success(orderService.getDeliveryOrders(userId)));
    }

    @PutMapping("/api/delivery/pickup/{orderId}")
    @Operation(summary = "Mark order as picked up")
    public ResponseEntity<ApiResponse<OrderDTO>> markPickedUp(@PathVariable String orderId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(orderId, OrderStatus.PICKED_UP)));
    }

    @PutMapping("/api/delivery/deliver/{orderId}")
    @Operation(summary = "Mark order as delivered")
    public ResponseEntity<ApiResponse<OrderDTO>> markDelivered(@PathVariable String orderId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(orderId, OrderStatus.DELIVERED)));
    }

    private String extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return tokenProvider.getUserIdFromToken(token);
    }
}
