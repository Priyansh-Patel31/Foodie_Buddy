package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.ApiResponse;
import com.foodiebuddy.admin.entity.FinancialTransaction;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/financials")
@RequiredArgsConstructor
@Tag(name = "Financials", description = "Financial Transaction APIs")
public class RevenueController {

    private final MongoTemplate mongoTemplate;

    @GetMapping("/transactions")
    @Operation(summary = "Get all financial transactions")
    public ResponseEntity<ApiResponse<List<FinancialTransaction>>> getAllTransactions() {
        List<FinancialTransaction> transactions = mongoTemplate.findAll(FinancialTransaction.class);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @PostMapping("/transactions")
    @Operation(summary = "Create a financial transaction")
    public ResponseEntity<ApiResponse<FinancialTransaction>> createTransaction(
            @RequestBody FinancialTransaction transaction) {
        transaction.onCreate();
        FinancialTransaction saved = mongoTemplate.save(transaction);
        return ResponseEntity.ok(ApiResponse.success("Transaction recorded", saved));
    }
}
