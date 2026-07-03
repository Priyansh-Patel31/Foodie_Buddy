package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.*;
import com.foodiebuddy.admin.entity.Task;
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
@Tag(name = "Manager", description = "Manager Dashboard APIs")
public class ManagerController {

    private final TaskService taskService;
    private final OrderService orderService;
    private final JwtTokenProvider tokenProvider;

    @GetMapping("/orders/active")
    @Operation(summary = "Get all active orders")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getActiveOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getActiveOrders()));
    }

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

    private String extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return tokenProvider.getUserIdFromToken(token);
    }
}
