package com.foodiebuddy.admin.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDTO {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String status;
    private LocalDateTime createdAt;
}
