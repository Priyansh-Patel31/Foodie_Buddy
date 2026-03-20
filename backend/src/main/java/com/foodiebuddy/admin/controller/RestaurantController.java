package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.ApiResponse;
import com.foodiebuddy.admin.dto.RestaurantDTO;
import com.foodiebuddy.admin.entity.enums.RestaurantStatus;
import com.foodiebuddy.admin.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurant Management", description = "Restaurant CRUD and Approval APIs")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    @Operation(summary = "List all restaurants")
    public ResponseEntity<ApiResponse<Page<RestaurantDTO>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<RestaurantDTO> result;
        if (search != null && !search.isBlank()) {
            result = restaurantService.searchRestaurants(search, pageable);
        } else if (status != null && !status.isBlank()) {
            result = restaurantService.getByStatus(RestaurantStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            result = restaurantService.getAllRestaurants(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get restaurant by ID")
    public ResponseEntity<ApiResponse<RestaurantDTO>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getById(id)));
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve a restaurant")
    public ResponseEntity<ApiResponse<RestaurantDTO>> approve(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Restaurant approved", restaurantService.approve(id)));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject a restaurant")
    public ResponseEntity<ApiResponse<RestaurantDTO>> reject(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Restaurant rejected", restaurantService.reject(id)));
    }

    @PutMapping("/{id}/suspend")
    @Operation(summary = "Suspend a restaurant")
    public ResponseEntity<ApiResponse<RestaurantDTO>> suspend(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Restaurant suspended", restaurantService.suspend(id)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a restaurant")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        restaurantService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Restaurant deleted", null));
    }
}
