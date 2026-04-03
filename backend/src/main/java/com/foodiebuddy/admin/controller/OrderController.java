package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.*;

import com.foodiebuddy.admin.exception.BadRequestException;
import com.foodiebuddy.admin.security.JwtTokenProvider;
import com.foodiebuddy.admin.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order Management APIs")
public class OrderController {

    private final OrderService orderService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/place")
    @Operation(summary = "Place a new order (Customer)")
    public ResponseEntity<ApiResponse<OrderDTO>> placeOrder(
            @RequestBody PlaceOrderRequest request, HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        OrderDTO order = orderService.placeOrder(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my orders (Customer)")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getMyOrders(HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(ApiResponse.success(orderService.getByCustomer(userId)));
    }

    @GetMapping("/my/{orderId}")
    @Operation(summary = "Get specific order (Customer)")
    public ResponseEntity<ApiResponse<OrderDTO>> getMyOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getById(orderId)));
    }

    @PostMapping("/{orderId}/rate")
    @Operation(summary = "Rate a delivered order (Customer)")
    public ResponseEntity<ApiResponse<OrderDTO>> rateOrder(
            @PathVariable String orderId,
            @RequestBody RatingRequest request) {
        return ResponseEntity.ok(ApiResponse.success(orderService.rateOrder(orderId, request)));
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
