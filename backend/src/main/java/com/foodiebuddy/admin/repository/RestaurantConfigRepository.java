package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.RestaurantConfig;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RestaurantConfigRepository extends MongoRepository<RestaurantConfig, String> {
}
