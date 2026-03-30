package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByActiveTrue();
    List<Category> findAllByOrderByDisplayOrderAsc();
}
