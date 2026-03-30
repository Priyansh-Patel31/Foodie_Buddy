package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.ApiResponse;
import com.foodiebuddy.admin.entity.User;
import com.foodiebuddy.admin.entity.enums.Role;
import com.foodiebuddy.admin.exception.BadRequestException;
import com.foodiebuddy.admin.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "User & Role Management APIs")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get all users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Don't expose passwords
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/{id}/role")
    @Operation(summary = "Update user role")
    public ResponseEntity<ApiResponse<User>> updateUserRole(
            @PathVariable String id, @RequestBody RoleUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not found: " + id));

        try {
            Role newRole = Role.valueOf(request.role);
            user.setRole(newRole);
            userRepository.save(user);
            user.setPassword(null);
            return ResponseEntity.ok(ApiResponse.success("Role updated", user));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + request.role);
        }
    }

    @PutMapping("/{id}/salary")
    @Operation(summary = "Update user salary")
    public ResponseEntity<ApiResponse<User>> updateSalary(
            @PathVariable String id, @RequestBody SalaryUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not found: " + id));
        user.setBaseSalary(request.baseSalary);
        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success("Salary updated", user));
    }

    @PutMapping("/{id}/leaves")
    @Operation(summary = "Update user leaves")
    public ResponseEntity<ApiResponse<User>> updateLeaves(
            @PathVariable String id, @RequestBody LeavesUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not found: " + id));
        user.setLeavesTakenThisMonth(request.leavesTaken);
        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success("Leaves updated", user));
    }

    // Simple inner DTOs
    record RoleUpdateRequest(String role) {}
    record SalaryUpdateRequest(java.math.BigDecimal baseSalary) {}
    record LeavesUpdateRequest(Integer leavesTaken) {}
}
