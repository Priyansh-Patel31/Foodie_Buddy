package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.CreateTaskRequest;
import com.foodiebuddy.admin.entity.Task;
import com.foodiebuddy.admin.entity.User;
import com.foodiebuddy.admin.entity.enums.TaskStatus;
import com.foodiebuddy.admin.entity.enums.TaskType;
import com.foodiebuddy.admin.exception.BadRequestException;
import com.foodiebuddy.admin.exception.ResourceNotFoundException;
import com.foodiebuddy.admin.repository.TaskRepository;
import com.foodiebuddy.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public List<Task> getByAssignedUser(String userId) {
        return taskRepository.findByAssignedToUserId(userId);
    }

    public List<Task> getPendingByUser(String userId) {
        return taskRepository.findByAssignedToUserIdAndStatus(userId, TaskStatus.PENDING);
    }

    public Task create(CreateTaskRequest request, String managerUserId) {
        User manager = userRepository.findById(managerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found"));
        User worker = userRepository.findById(request.getAssignedToUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        TaskType type;
        try {
            type = TaskType.valueOf(request.getType());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid task type: " + request.getType());
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(type)
                .status(TaskStatus.PENDING)
                .assignedByUserId(manager.getId())
                .assignedByUserName(manager.getName())
                .assignedToUserId(worker.getId())
                .assignedToUserName(worker.getName())
                .build();
        task.onCreate();

        log.info("Task created: '{}' assigned to {}", task.getTitle(), worker.getName());
        return taskRepository.save(task);
    }

    public Task startTask(String taskId) {
        Task task = findById(taskId);
        task.setStatus(TaskStatus.IN_PROGRESS);
        return taskRepository.save(task);
    }

    public Task completeTask(String taskId) {
        Task task = findById(taskId);
        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        log.info("Task completed: '{}'", task.getTitle());
        return taskRepository.save(task);
    }

    private Task findById(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }
}
