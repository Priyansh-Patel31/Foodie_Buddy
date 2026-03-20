package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.Commission;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommissionRepository extends MongoRepository<Commission, String> {
    List<Commission> findByRestaurantId(String restaurantId);

    @Aggregation(pipeline = {
            "{ $match: { waived: false } }",
            "{ $group: { _id: null, total: { $sum: '$amount' } } }"
    })
    org.bson.Document sumCollectedCommission();

    @Aggregation(pipeline = {
            "{ $match: { waived: true } }",
            "{ $group: { _id: null, total: { $sum: '$amount' } } }"
    })
    org.bson.Document sumWaivedCommission();
}
