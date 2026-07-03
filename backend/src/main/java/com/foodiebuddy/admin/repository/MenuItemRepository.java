package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface MenuItemRepository extends MongoRepository<MenuItem, String> {
    Optional<MenuItem> findByName(String name);
    List<MenuItem> findByCategoryId(String categoryId);
    List<MenuItem> findByIsAvailableTrue();
    List<MenuItem> findByCategoryIdAndIsAvailableTrue(String categoryId);
    List<MenuItem> findByNameContainingIgnoreCase(String name);
}
