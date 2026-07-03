package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.*;
import com.foodiebuddy.admin.entity.*;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
import com.foodiebuddy.admin.entity.enums.Role;
import com.foodiebuddy.admin.repository.UserRepository;
import com.foodiebuddy.admin.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin Management APIs")
public class AdminController {

    private final AuthService authService;
    private final MenuService menuService;
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final DashboardService dashboardService;
    private final com.foodiebuddy.admin.repository.RestaurantConfigRepository configRepository;

    @PostMapping("/staff")
    @Operation(summary = "Create staff account")
    public ResponseEntity<ApiResponse<LoginResponse>> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Staff created", authService.createStaff(request)));
    }

    @GetMapping("/staff")
    @Operation(summary = "Get all staff members")
    public ResponseEntity<ApiResponse<List<User>>> getStaff() {
        List<User> staff = userRepository.findAll().stream()
                .filter(u -> u.getRole() != Role.ROLE_CUSTOMER).toList();
        return ResponseEntity.ok(ApiResponse.success(staff));
    }

    @GetMapping("/customers")
    @Operation(summary = "Get all customers")
    public ResponseEntity<ApiResponse<List<User>>> getCustomers() {
        return ResponseEntity.ok(ApiResponse.success(userRepository.findByRole(Role.ROLE_CUSTOMER)));
    }

    @GetMapping("/menu")
    @Operation(summary = "Get ALL menu items (including unavailable)")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getAllMenuItems() {
        return ResponseEntity.ok(ApiResponse.success(menuService.getAll()));
    }

    @PostMapping("/menu")
    @Operation(summary = "Create menu item")
    public ResponseEntity<ApiResponse<MenuItem>> createMenuItem(@RequestBody MenuItem item) {
        return ResponseEntity.ok(ApiResponse.success(menuService.create(item)));
    }

    @PutMapping("/menu/{id}")
    @Operation(summary = "Update menu item")
    public ResponseEntity<ApiResponse<MenuItem>> updateMenuItem(@PathVariable String id, @RequestBody MenuItem item) {
        return ResponseEntity.ok(ApiResponse.success(menuService.update(id, item)));
    }

    @DeleteMapping("/menu/{id}")
    @Operation(summary = "Delete menu item")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable String id) {
        menuService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    @PutMapping("/menu/{id}/toggle")
    @Operation(summary = "Toggle menu item availability")
    public ResponseEntity<ApiResponse<MenuItem>> toggleMenuItem(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(menuService.toggleAvailability(id)));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get all orders")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAll()));
    }

    @PutMapping("/orders/{id}/confirm")
    @Operation(summary = "Confirm an order")
    public ResponseEntity<ApiResponse<OrderDTO>> confirmOrder(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(id, OrderStatus.CONFIRMED)));
    }

    @PutMapping("/orders/{id}/cancel")
    @Operation(summary = "Cancel an order")
    public ResponseEntity<ApiResponse<OrderDTO>> cancelOrder(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(id, OrderStatus.CANCELLED)));
    }

    @PutMapping("/orders/{id}/assign-delivery/{deliveryUserId}")
    @Operation(summary = "Assign delivery user to order")
    public ResponseEntity<ApiResponse<OrderDTO>> assignDelivery(
            @PathVariable String id, @PathVariable String deliveryUserId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.assignDelivery(id, deliveryUserId)));
    }

    @PutMapping("/orders/{id}/assign-chef/{chefUserId}")
    @Operation(summary = "Assign chef user to order")
    public ResponseEntity<ApiResponse<OrderDTO>> assignChef(
            @PathVariable String id, @PathVariable String chefUserId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.assignChef(id, chefUserId)));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStats()));
    }

    @GetMapping("/config")
    @Operation(summary = "Get restaurant config")
    public ResponseEntity<ApiResponse<RestaurantConfig>> getConfig() {
        RestaurantConfig config = configRepository.findAll().stream().findFirst()
                .orElseGet(() -> configRepository.save(RestaurantConfig.defaultConfig()));
        return ResponseEntity.ok(ApiResponse.success(config));
    }

    @PutMapping("/config")
    @Operation(summary = "Update restaurant config")
    public ResponseEntity<ApiResponse<RestaurantConfig>> updateConfig(@RequestBody RestaurantConfig config) {
        RestaurantConfig existing = configRepository.findAll().stream().findFirst()
                .orElseGet(RestaurantConfig::defaultConfig);
        config.setId(existing.getId());
        return ResponseEntity.ok(ApiResponse.success(configRepository.save(config)));
    }
}
