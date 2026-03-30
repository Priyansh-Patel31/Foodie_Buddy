package com.foodiebuddy.admin.repository;

import com.foodiebuddy.admin.entity.Task;
import com.foodiebuddy.admin.entity.enums.TaskStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByAssignedToUserId(String userId);
    List<Task> findByAssignedToUserIdAndStatus(String userId, TaskStatus status);
    List<Task> findByStatus(TaskStatus status);
}
