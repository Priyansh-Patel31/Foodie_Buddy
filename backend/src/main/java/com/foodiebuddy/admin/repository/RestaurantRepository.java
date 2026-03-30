package com.foodiebuddy.admin.repository;
import com.foodiebuddy.admin.entity.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {}
