package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.*;
import com.foodiebuddy.admin.entity.Task;
import com.foodiebuddy.admin.entity.User;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
import com.foodiebuddy.admin.entity.enums.Role;
import com.foodiebuddy.admin.exception.BadRequestException;
import com.foodiebuddy.admin.security.JwtTokenProvider;
import com.foodiebuddy.admin.service.TaskService;
import com.foodiebuddy.admin.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@Tag(name = "Manager", description = "Manager Dashboard & Order Management APIs")
public class ManagerController {

    private final TaskService taskService;
    private final OrderService orderService;
    private final JwtTokenProvider tokenProvider;

    // ==================== ORDER MANAGEMENT ====================

    @GetMapping("/orders")
    @Operation(summary = "Get all orders (Manager view)")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAll()));
    }

    @GetMapping("/orders/active")
    @Operation(summary = "Get all active orders")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getActiveOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getActiveOrders()));
    }

    @GetMapping("/orders/placed")
    @Operation(summary = "Get new orders awaiting manager confirmation")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getPlacedOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getPlacedOrders()));
    }

    @PutMapping("/orders/{id}/confirm")
    @Operation(summary = "Confirm a PLACED order (Manager)")
    public ResponseEntity<ApiResponse<OrderDTO>> confirmOrder(
            @PathVariable String id, HttpServletRequest httpRequest) {
        String managerId = extractUserId(httpRequest);
        return ResponseEntity.ok(ApiResponse.success("Order confirmed", orderService.confirmOrder(id, managerId)));
    }

    @PutMapping("/orders/{id}/cancel")
    @Operation(summary = "Cancel an order (Manager)")
    public ResponseEntity<ApiResponse<OrderDTO>> cancelOrder(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", orderService.updateStatus(id, OrderStatus.CANCELLED)));
    }

    @PutMapping("/orders/{id}/assign-chef/{chefUserId}")
    @Operation(summary = "Assign a chef to an order (Manager)")
    public ResponseEntity<ApiResponse<OrderDTO>> assignChef(
            @PathVariable String id,
            @PathVariable String chefUserId,
            HttpServletRequest httpRequest) {
        String managerId = extractUserId(httpRequest);
        return ResponseEntity.ok(ApiResponse.success("Chef assigned", orderService.assignChefByManager(id, chefUserId, managerId)));
    }

    @PutMapping("/orders/{id}/assign-delivery/{deliveryUserId}")
    @Operation(summary = "Assign a delivery partner to an order (Manager)")
    public ResponseEntity<ApiResponse<OrderDTO>> assignDelivery(
            @PathVariable String id,
            @PathVariable String deliveryUserId,
            HttpServletRequest httpRequest) {
        String managerId = extractUserId(httpRequest);
        return ResponseEntity.ok(ApiResponse.success("Delivery assigned", orderService.assignDeliveryByManager(id, deliveryUserId, managerId)));
    }

    // ==================== STAFF INFO ====================

    @GetMapping("/staff/chefs")
    @Operation(summary = "Get available chefs")
    public ResponseEntity<ApiResponse<List<User>>> getAvailableChefs() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAvailableStaffByRole(Role.ROLE_CHEF)));
    }

    @GetMapping("/staff/delivery")
    @Operation(summary = "Get available delivery partners")
    public ResponseEntity<ApiResponse<List<User>>> getAvailableDeliveryStaff() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAvailableStaffByRole(Role.ROLE_DELIVERY)));
    }

    // ==================== TASK MANAGEMENT ====================

    @GetMapping("/tasks")
    @Operation(summary = "Get all tasks")
    public ResponseEntity<ApiResponse<List<Task>>> getAllTasks() {
        return ResponseEntity.ok(ApiResponse.success(taskService.getAll()));
    }

    @PostMapping("/tasks")
    @Operation(summary = "Create and assign a task")
    public ResponseEntity<ApiResponse<Task>> createTask(
            @Valid @RequestBody CreateTaskRequest request, HttpServletRequest httpRequest) {
        String managerId = extractUserId(httpRequest);
        return ResponseEntity.ok(ApiResponse.success("Task created", taskService.create(request, managerId)));
    }

    // ==================== HELPERS ====================

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
