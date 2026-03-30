package com.foodiebuddy.admin.repository;
import com.foodiebuddy.admin.entity.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface ComplaintRepository extends MongoRepository<Complaint, String> {}
