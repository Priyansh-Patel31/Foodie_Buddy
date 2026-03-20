package com.foodiebuddy.admin.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ComplaintDTO {
    private String id;
    private String userId;
    private String userName;
    private String orderId;
    private String description;
    private String status;
    private LocalDateTime createdAt;
}
