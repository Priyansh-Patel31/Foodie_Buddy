// DEPRECATED: Single-restaurant model has no Restaurant entity.
package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "restaurants_deprecated")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Restaurant {
    @Id
    private String id;
    private String name;
}
