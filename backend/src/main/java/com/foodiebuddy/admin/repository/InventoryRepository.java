package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.Inventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface InventoryRepository extends MongoRepository<Inventory, String> {

    @Query("{ $expr: { $lte: ['$currentStock', '$lowStockThreshold'] } }")
    List<Inventory> findLowStockItems();
}
