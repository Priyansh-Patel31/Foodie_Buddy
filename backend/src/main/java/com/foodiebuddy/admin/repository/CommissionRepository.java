package com.foodiebuddy.admin.repository;
import com.foodiebuddy.admin.entity.Commission;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface CommissionRepository extends MongoRepository<Commission, String> {}
