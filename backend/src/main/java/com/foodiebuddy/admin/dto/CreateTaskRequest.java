package com.foodiebuddy.admin.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateTaskRequest {
    @NotBlank(message = "Task title is required")
    private String title;
    private String description;
    @NotBlank(message = "Task type is required")
    private String type; // CLEANING, SERVING, MAINTENANCE, OTHER
    @NotBlank(message = "Assigned user is required")
    private String assignedToUserId;
}
