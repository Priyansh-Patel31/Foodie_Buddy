package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.User;
import com.foodiebuddy.admin.entity.enums.Role;
import com.foodiebuddy.admin.entity.enums.UserStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByRoleAndStatus(Role role, UserStatus status);
    long countByRole(Role role);
}
