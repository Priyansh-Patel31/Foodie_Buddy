package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.Order;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    Page<Order> findByRestaurantId(String restaurantId, Pageable pageable);
    Page<Order> findByUserId(String userId, Pageable pageable);

    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 } }")
    Page<Order> findByDateRange(LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query(value = "{ 'createdAt': { $gte: ?0 } }", count = true)
    long countOrdersSince(LocalDateTime start);

    long countByStatus(OrderStatus status);

    @Aggregation(pipeline = {
            "{ $group: { _id: null, total: { $sum: '$totalAmount' } } }"
    })
    org.bson.Document sumTotalRevenue();

    @Aggregation(pipeline = {
            "{ $group: { _id: null, total: { $sum: '$platformRevenue' } } }"
    })
    org.bson.Document sumPlatformRevenue();

    @Aggregation(pipeline = {
            "{ $group: { _id: null, total: { $sum: '$restaurantRevenue' } } }"
    })
    org.bson.Document sumRestaurantRevenue();

    @Aggregation(pipeline = {
            "{ $group: { _id: null, total: { $sum: '$commissionAmount' } } }"
    })
    org.bson.Document sumCommissionAmount();

    @Aggregation(pipeline = {
            "{ $match: { distanceKm: { $lte: 2.0 } } }",
            "{ $group: { _id: null, total: { $sum: '$commissionAmount' } } }"
    })
    org.bson.Document sumCommissionWaived();

    @Aggregation(pipeline = {
            "{ $match: { createdAt: { $gte: ?0, $lte: ?1 } } }",
            "{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, orderCount: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }",
            "{ $sort: { '_id': 1 } }"
    })
    List<org.bson.Document> getDailyStats(LocalDateTime start, LocalDateTime end);

    @Aggregation(pipeline = {
            "{ $group: { _id: '$restaurant', orderCount: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' }, platformRevenue: { $sum: '$platformRevenue' } } }",
            "{ $sort: { 'totalAmount': -1 } }"
    })
    List<org.bson.Document> getRevenueByRestaurant();
}
