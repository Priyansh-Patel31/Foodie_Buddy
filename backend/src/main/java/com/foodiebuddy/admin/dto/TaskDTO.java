package com.foodiebuddy.admin.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskDTO {
    private String id;
    private String title;
    private String description;
    private String type;
    private String status;
    private String assignedToUserId;
    private String assignedToUserName;
    private String assignedByUserName;
    private String createdAt;
    private String completedAt;
}
