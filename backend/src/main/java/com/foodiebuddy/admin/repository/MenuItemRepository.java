package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MenuItemRepository extends MongoRepository<MenuItem, String> {
    List<MenuItem> findByRestaurantId(String restaurantId);
    List<MenuItem> findByCategoryId(String categoryId);
}
