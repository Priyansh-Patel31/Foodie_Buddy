package com.foodiebuddy.admin.dto;

import lombok.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RegisterRequest {
    @NotBlank
    private String name;
    @Email @NotBlank
    private String email;
    @NotBlank
    private String password;
    private String phone;
}
