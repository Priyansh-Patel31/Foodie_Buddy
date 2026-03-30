package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.Order;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomerId(String customerId);
    Page<Order> findByCustomerId(String customerId, Pageable pageable);
    List<Order> findByStatus(OrderStatus status);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    List<Order> findByAssignedDeliveryUserId(String deliveryUserId);
    List<Order> findByStatusIn(List<OrderStatus> statuses);

    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 } }")
    List<Order> findByDateRange(LocalDateTime start, LocalDateTime end);

    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 } }")
    Page<Order> findByDateRange(LocalDateTime start, LocalDateTime end, Pageable pageable);

    long countByStatus(OrderStatus status);

    @Query("{ 'status': { $in: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'PICKED_UP', 'OUT_FOR_DELIVERY'] } }")
    List<Order> findActiveOrders();
}
