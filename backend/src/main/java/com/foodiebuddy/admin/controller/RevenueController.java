package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.*;
import com.foodiebuddy.admin.service.RevenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
@Tag(name = "Revenue Analytics", description = "Revenue & Commission APIs")
public class RevenueController {

    private final RevenueService revenueService;

    @GetMapping
    @Operation(summary = "Get overall revenue stats")
    public ResponseEntity<ApiResponse<RevenueStatsDTO>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(revenueService.getRevenueStats()));
    }

    @GetMapping("/daily")
    @Operation(summary = "Get daily revenue for last N days")
    public ResponseEntity<ApiResponse<List<DailyRevenueDTO>>> getDaily(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success(revenueService.getDailyRevenue(days)));
    }

    @GetMapping("/restaurants")
    @Operation(summary = "Get revenue per restaurant")
    public ResponseEntity<ApiResponse<List<RestaurantRevenueDTO>>> getByRestaurant() {
        return ResponseEntity.ok(ApiResponse.success(revenueService.getRevenueByRestaurant()));
    }
}
