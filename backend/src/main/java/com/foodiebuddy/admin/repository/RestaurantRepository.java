package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.Restaurant;
import com.foodiebuddy.admin.entity.enums.RestaurantStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    Page<Restaurant> findByStatus(RestaurantStatus status, Pageable pageable);

    @Query("{ '$or': [ { 'name': { $regex: ?0, $options: 'i' } }, { 'ownerName': { $regex: ?0, $options: 'i' } } ] }")
    Page<Restaurant> searchRestaurants(String search, Pageable pageable);

    long countByStatus(RestaurantStatus status);

    List<Restaurant> findByStatus(RestaurantStatus status);
}
