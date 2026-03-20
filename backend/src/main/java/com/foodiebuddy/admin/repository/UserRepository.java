package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.User;
import com.foodiebuddy.admin.entity.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UserRepository extends MongoRepository<User, String> {
    Page<User> findByStatus(UserStatus status, Pageable pageable);

    @Query("{ '$or': [ { 'name': { $regex: ?0, $options: 'i' } }, { 'email': { $regex: ?0, $options: 'i' } } ] }")
    Page<User> searchUsers(String search, Pageable pageable);

    long countByStatus(UserStatus status);
}
