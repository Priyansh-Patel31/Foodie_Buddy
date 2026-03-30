package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.ApiResponse;
import com.foodiebuddy.admin.entity.Task;
import com.foodiebuddy.admin.security.JwtTokenProvider;
import com.foodiebuddy.admin.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Worker Tasks", description = "Waiter & Cleaner Task APIs")
public class WorkerTaskController {

    private final TaskService taskService;
    private final JwtTokenProvider tokenProvider;

    @GetMapping("/api/waiter/tasks")
    @Operation(summary = "Get waiter's assigned tasks")
    public ResponseEntity<ApiResponse<List<Task>>> getWaiterTasks(HttpServletRequest request) {
        String userId = extractUserId(request);
        return ResponseEntity.ok(ApiResponse.success(taskService.getByAssignedUser(userId)));
    }

    @GetMapping("/api/cleaner/tasks")
    @Operation(summary = "Get cleaner's assigned tasks")
    public ResponseEntity<ApiResponse<List<Task>>> getCleanerTasks(HttpServletRequest request) {
        String userId = extractUserId(request);
        return ResponseEntity.ok(ApiResponse.success(taskService.getByAssignedUser(userId)));
    }

    @PutMapping("/api/waiter/tasks/{taskId}/start")
    @Operation(summary = "Start a task")
    public ResponseEntity<ApiResponse<Task>> startTask(@PathVariable String taskId) {
        return ResponseEntity.ok(ApiResponse.success(taskService.startTask(taskId)));
    }

    @PutMapping("/api/waiter/tasks/{taskId}/complete")
    @Operation(summary = "Complete a task")
    public ResponseEntity<ApiResponse<Task>> completeWaiterTask(@PathVariable String taskId) {
        return ResponseEntity.ok(ApiResponse.success(taskService.completeTask(taskId)));
    }

    @PutMapping("/api/cleaner/tasks/{taskId}/complete")
    @Operation(summary = "Mark cleaning task as done")
    public ResponseEntity<ApiResponse<Task>> completeCleanerTask(@PathVariable String taskId) {
        return ResponseEntity.ok(ApiResponse.success(taskService.completeTask(taskId)));
    }

    private String extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return tokenProvider.getUserIdFromToken(token);
    }
}
