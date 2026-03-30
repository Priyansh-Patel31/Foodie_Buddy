// DEPRECATED: Complaint entity - to be re-implemented later.
package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "complaints_deprecated")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Complaint {
    @Id
    private String id;
}
