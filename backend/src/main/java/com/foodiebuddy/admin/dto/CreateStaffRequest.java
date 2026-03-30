package com.foodiebuddy.admin.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateStaffRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    private String phone;
    @NotBlank
    private String role; // ROLE_MANAGER, ROLE_CHEF, etc.
}
