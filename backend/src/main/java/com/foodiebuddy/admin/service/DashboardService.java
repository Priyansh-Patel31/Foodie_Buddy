package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.DashboardStatsDTO;
import com.foodiebuddy.admin.entity.enums.OrderStatus;
import com.foodiebuddy.admin.entity.enums.Role;
import com.foodiebuddy.admin.entity.enums.TaskStatus;
import com.foodiebuddy.admin.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;
    private final TaskRepository taskRepository;

    public DashboardStatsDTO getStats() {
        long totalOrders = orderRepository.count();
        long activeOrders = orderRepository.findActiveOrders().size();
        long totalCustomers = userRepository.countByRole(Role.ROLE_CUSTOMER);
        long totalStaff = userRepository.findAll().stream()
                .filter(u -> u.getRole() != Role.ROLE_CUSTOMER).count();
        double totalRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PLACED);
        long lowStockItems = inventoryRepository.findLowStockItems().size();
        long pendingTasks = taskRepository.findByStatus(TaskStatus.PENDING).size();

        return DashboardStatsDTO.builder()
                .totalOrders(totalOrders)
                .activeOrders(activeOrders)
                .totalCustomers(totalCustomers)
                .totalStaff(totalStaff)
                .totalRevenue(totalRevenue)
                .pendingOrders(pendingOrders)
                .lowStockItems(lowStockItems)
                .pendingTasks(pendingTasks)
                .build();
    }
}
