// DEPRECATED: This entity is no longer used in the single-restaurant architecture.
package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "admins_deprecated")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Admin {
    @Id
    private String id;
    private String username;
    private String password;
    private String role;
}
