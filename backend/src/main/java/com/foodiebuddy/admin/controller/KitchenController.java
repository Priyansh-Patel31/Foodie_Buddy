package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.*;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
import com.foodiebuddy.admin.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    @GetMapping("/orders")
    @Operation(summary = "Get kitchen orders (Confirmed + Preparing)")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getKitchenOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getKitchenOrders()));
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
}
