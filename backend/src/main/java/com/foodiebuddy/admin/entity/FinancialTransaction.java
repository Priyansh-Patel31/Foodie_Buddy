package com.foodiebuddy.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "financial_transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FinancialTransaction {

    @Id
    private String id;

    // e.g., "PAYROLL", "ORDER_REVENUE", "EXPENSE", "ADJUSTMENT"
    private String transactionType;
    
    // Description of the transaction
    private String description;

    // Amount involved (negative for payroll/expenses, positive for revenue)
    private BigDecimal amount;

    // For linking back to a specific order or user
    private String referenceId;
    
    // e.g. "STAFF_USER", "ORDER"
    private String referenceType;

    private LocalDateTime transactionDate;

    public void onCreate() {
        if (this.transactionDate == null) {
            this.transactionDate = LocalDateTime.now();
        }
    }
}
