package com.foodiebuddy.admin.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginResponse {
    private String token;
    private String userId;
    private String name;
    private String email;
    private String role;
}
