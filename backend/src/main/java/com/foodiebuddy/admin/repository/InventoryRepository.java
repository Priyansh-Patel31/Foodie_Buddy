package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.Inventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends MongoRepository<Inventory, String> {
    Optional<Inventory> findByName(String name);

    @Query("{ $expr: { $lte: ['$currentStock', '$lowStockThreshold'] } }")
    List<Inventory> findLowStockItems();
}
