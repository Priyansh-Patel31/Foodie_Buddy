package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends MongoRepository<Category, String> {
    Optional<Category> findByName(String name);
    List<Category> findByActiveTrue();
    List<Category> findAllByOrderByDisplayOrderAsc();
}
