package com.foodiebuddy.admin.repository;
import com.foodiebuddy.admin.entity.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface PaymentRepository extends MongoRepository<Payment, String> {}
