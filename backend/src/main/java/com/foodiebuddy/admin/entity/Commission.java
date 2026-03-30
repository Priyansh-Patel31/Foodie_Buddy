// DEPRECATED: Commission tracking removed in single-restaurant model.
package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "commissions_deprecated")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Commission {
    @Id
    private String id;
}
