package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.Complaint;
import com.foodiebuddy.admin.entity.enums.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);
    long countByStatus(ComplaintStatus status);
}
