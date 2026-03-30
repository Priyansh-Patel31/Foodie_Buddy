package com.foodiebuddy.admin.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateTaskRequest {
    @NotBlank
    private String title;
    private String description;
    @NotBlank
    private String type; // CLEANING, SERVING, MAINTENANCE, OTHER
    @NotBlank
    private String assignedToUserId;
}
