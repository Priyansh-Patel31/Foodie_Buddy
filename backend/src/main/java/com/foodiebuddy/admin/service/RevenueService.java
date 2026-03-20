package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.DailyRevenueDTO;
import com.foodiebuddy.admin.dto.RestaurantRevenueDTO;
import com.foodiebuddy.admin.dto.RevenueStatsDTO;
import com.foodiebuddy.admin.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevenueService {

    private final OrderRepository orderRepository;
    private final com.foodiebuddy.admin.repository.RestaurantRepository restaurantRepository;

    private BigDecimal extractTotal(org.bson.Document doc) {
        if (doc == null || doc.get("total") == null) {
            return BigDecimal.ZERO;
        }
        return new BigDecimal(doc.get("total").toString());
    }

    public RevenueStatsDTO getRevenueStats() {
        return RevenueStatsDTO.builder()
                .totalPlatformRevenue(extractTotal(orderRepository.sumPlatformRevenue()))
                .totalRestaurantRevenue(extractTotal(orderRepository.sumRestaurantRevenue()))
                .totalCommissionCollected(extractTotal(orderRepository.sumCommissionAmount()))
                .totalCommissionWaived(extractTotal(orderRepository.sumCommissionWaived()))
                .totalOrderValue(extractTotal(orderRepository.sumTotalRevenue()))
                .build();
    }

    public List<DailyRevenueDTO> getDailyRevenue(int days) {
        LocalDateTime start = LocalDateTime.of(LocalDate.now().minusDays(days), LocalTime.MIN);
        LocalDateTime end = LocalDateTime.now();

        List<org.bson.Document> results = orderRepository.getDailyStats(start, end);
        return results.stream().map((org.bson.Document doc) -> DailyRevenueDTO.builder()
                .date(LocalDate.parse(doc.getString("_id")))
                .orderCount(((Number) doc.get("orderCount")).longValue())
                .revenue(new BigDecimal(doc.get("revenue").toString()))
                .build()).collect(Collectors.toList());
    }

    public List<RestaurantRevenueDTO> getRevenueByRestaurant() {
        List<org.bson.Document> results = orderRepository.getRevenueByRestaurant();
        return results.stream().map((org.bson.Document doc) -> {
            String restaurantId = doc.get("_id") != null ? doc.get("_id").toString() : "Unknown";
            String restaurantName = "Unknown";
            if (!"Unknown".equals(restaurantId)) {
                com.foodiebuddy.admin.entity.Restaurant r = restaurantRepository.findById(restaurantId).orElse(null);
                if (r != null) {
                    restaurantName = r.getName();
                }
            }
            return RestaurantRevenueDTO.builder()
                .restaurantId(restaurantId)
                .restaurantName(restaurantName)
                .orderCount(((Number) doc.get("orderCount")).longValue())
                .totalRevenue(new BigDecimal(doc.get("totalAmount").toString()))
                .platformRevenue(new BigDecimal(doc.get("platformRevenue").toString()))
                .build();
        }).collect(Collectors.toList());
    }
}
