package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.ApiResponse;
import com.foodiebuddy.admin.dto.OrderDTO;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
import com.foodiebuddy.admin.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Order Monitoring", description = "Order Monitoring APIs")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "List orders with filters")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String restaurantId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<OrderDTO> result;
        if (status != null && !status.isBlank()) {
            result = orderService.getByStatus(OrderStatus.valueOf(status.toUpperCase()), pageable);
        } else if (restaurantId != null) {
            result = orderService.getByRestaurant(restaurantId, pageable);
        } else if (userId != null) {
            result = orderService.getByUser(userId, pageable);
        } else if (startDate != null && endDate != null) {
            result = orderService.getByDateRange(startDate, endDate, pageable);
        } else {
            result = orderService.getAllOrders(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details")
    public ResponseEntity<ApiResponse<OrderDTO>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getById(id)));
    }
}
