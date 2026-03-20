package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.DashboardStatsDTO;
import com.foodiebuddy.admin.entity.enums.ComplaintStatus;
import com.foodiebuddy.admin.entity.enums.RestaurantStatus;
import com.foodiebuddy.admin.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;

    private BigDecimal extractTotal(org.bson.Document doc) {
        if (doc == null || doc.get("total") == null) {
            return BigDecimal.ZERO;
        }
        return new BigDecimal(doc.get("total").toString());
    }

    public DashboardStatsDTO getStats() {
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);

        return DashboardStatsDTO.builder()
                .totalOrders(orderRepository.count())
                .totalRevenue(extractTotal(orderRepository.sumTotalRevenue()))
                .totalRestaurants(restaurantRepository.count())
                .totalUsers(userRepository.count())
                .todaysOrders(orderRepository.countOrdersSince(todayStart))
                .pendingApprovals(restaurantRepository.countByStatus(RestaurantStatus.PENDING))
                .activeRestaurants(restaurantRepository.countByStatus(RestaurantStatus.APPROVED))
                .openComplaints(complaintRepository.countByStatus(ComplaintStatus.OPEN))
                .build();
    }
}
