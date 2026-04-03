package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.*;
import com.foodiebuddy.admin.exception.BadRequestException;
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
    public ResponseEntity<ApiResponse<OrderDTO>> markPickedUp(@PathVariable String orderId, HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(ApiResponse.success(orderService.pickupOrder(orderId, userId)));
    }

    @PutMapping("/api/delivery/start/{orderId}")
    @Operation(summary = "Start delivery (order is out for delivery)")
    public ResponseEntity<ApiResponse<OrderDTO>> startDelivery(@PathVariable String orderId, HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(ApiResponse.success(orderService.startDelivery(orderId, userId)));
    }

    @PutMapping("/api/delivery/deliver/{orderId}")
    @Operation(summary = "Mark order as delivered")
    public ResponseEntity<ApiResponse<OrderDTO>> markDelivered(@PathVariable String orderId, HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(ApiResponse.success(orderService.completeDelivery(orderId, userId)));
    }

    private String extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.length() <= 7) {
            throw new BadRequestException("Missing or invalid Authorization header");
        }
        try {
            return tokenProvider.getUserIdFromToken(authHeader.substring(7));
        } catch (Exception ex) {
            throw new BadRequestException("Invalid authentication token");
        }
    }
}
