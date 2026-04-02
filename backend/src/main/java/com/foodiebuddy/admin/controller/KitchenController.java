package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.*;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
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
@RequestMapping("/api/kitchen")
@RequiredArgsConstructor
@Tag(name = "Kitchen", description = "Chef Kitchen Display APIs")
public class KitchenController {

    private final OrderService orderService;
    private final JwtTokenProvider tokenProvider;

    @GetMapping("/orders")
    @Operation(summary = "Get kitchen orders (Confirmed + Preparing)")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getKitchenOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getKitchenOrders()));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get orders assigned to this chef")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getMyOrders(HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(ApiResponse.success(orderService.getKitchenOrdersForChef(userId)));
    }

    @PutMapping("/start/{orderId}")
    @Operation(summary = "Start cooking an order")
    public ResponseEntity<ApiResponse<OrderDTO>> startCooking(@PathVariable String orderId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(orderId, OrderStatus.PREPARING)));
    }

    @PutMapping("/ready/{orderId}")
    @Operation(summary = "Mark order as ready")
    public ResponseEntity<ApiResponse<OrderDTO>> markReady(@PathVariable String orderId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(orderId, OrderStatus.READY)));
    }

    private String extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return tokenProvider.getUserIdFromToken(token);
    }
}
