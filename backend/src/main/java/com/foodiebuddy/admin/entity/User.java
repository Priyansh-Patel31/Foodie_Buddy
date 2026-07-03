package com.foodiebuddy.admin.entity;

import com.foodiebuddy.admin.entity.enums.Role;
import com.foodiebuddy.admin.entity.enums.UserStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Document(collection = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String phone;

    private Role role;

    private UserStatus status;

    // Location fields for delivery
    private Double latitude;
    private Double longitude;
    private String addressText;

    private LocalDateTime createdAt;
    
    // Payroll & Attendance Fields
    private java.math.BigDecimal baseSalary;
    private Integer leavesTakenThisMonth;

    // Rating System Fields
    private Double averageRating;
    private Integer ratingCount;

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = UserStatus.ACTIVE;
        if (this.role == null) this.role = Role.ROLE_CUSTOMER;
        if (this.ratingCount == null) this.ratingCount = 0;
        if (this.averageRating == null) this.averageRating = 0.0;
    }
}
