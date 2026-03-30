package com.foodiebuddy.admin.controller;

import com.foodiebuddy.admin.dto.ApiResponse;
import com.foodiebuddy.admin.entity.Inventory;
import com.foodiebuddy.admin.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "Inventory Management APIs")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "Get all inventory items")
    public ResponseEntity<ApiResponse<List<Inventory>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAll()));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get low stock items")
    public ResponseEntity<ApiResponse<List<Inventory>>> getLowStock() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getLowStockItems()));
    }

    @PostMapping
    @Operation(summary = "Add inventory item")
    public ResponseEntity<ApiResponse<Inventory>> create(@RequestBody Inventory item) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.create(item)));
    }

    @PutMapping("/{id}/restock")
    @Operation(summary = "Restock an inventory item")
    public ResponseEntity<ApiResponse<Inventory>> restock(
            @PathVariable String id, @RequestParam Double quantity) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.restock(id, quantity)));
    }
}
