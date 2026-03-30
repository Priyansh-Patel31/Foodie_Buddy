package com.foodiebuddy.admin.entity;

import com.foodiebuddy.admin.entity.enums.TaskStatus;
import com.foodiebuddy.admin.entity.enums.TaskType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Task {

    @Id
    private String id;

    private String title;

    private String description;

    private TaskType type;

    private TaskStatus status;

    // Who assigned and who is assigned
    private String assignedByUserId;
    private String assignedByUserName;
    private String assignedToUserId;
    private String assignedToUserName;

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = TaskStatus.PENDING;
    }
}
