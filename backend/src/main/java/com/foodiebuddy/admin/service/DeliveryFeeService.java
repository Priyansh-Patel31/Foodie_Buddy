package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.DeliveryFeeRequest;
import com.foodiebuddy.admin.dto.DeliveryFeeResponse;
import com.foodiebuddy.admin.entity.RestaurantConfig;
import com.foodiebuddy.admin.repository.RestaurantConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeliveryFeeService {

    private final RestaurantConfigRepository configRepository;

    /**
     * Calculate delivery fee using Haversine formula for distance.
     * Pricing tiers:
     * - Distance <= freeDeliveryRadiusKm (default 1.5 km): FREE
     * - Distance > freeDeliveryRadiusKm: baseFee + perKmFee * (distance - freeRadius)
     */
    public DeliveryFeeResponse calculateFee(DeliveryFeeRequest request) {
        RestaurantConfig config = getConfig();

        double distance = haversineDistance(
                config.getLatitude(), config.getLongitude(),
                request.getCustomerLatitude(), request.getCustomerLongitude()
        );

        distance = Math.round(distance * 10.0) / 10.0; // Round to 1 decimal

        BigDecimal fee;
        boolean isFree;
        String message;

        if (distance <= config.getFreeDeliveryRadiusKm()) {
            fee = BigDecimal.ZERO;
            isFree = true;
            message = "Free delivery! You are within " + config.getFreeDeliveryRadiusKm() + " km.";
        } else {
            double extraKm = distance - config.getFreeDeliveryRadiusKm();
            double feeAmount = config.getBaseDeliveryFee() + (config.getPerKmDeliveryFee() * extraKm);
            fee = BigDecimal.valueOf(feeAmount).setScale(2, RoundingMode.HALF_UP);
            isFree = false;
            message = String.format("Delivery fee for %.1f km distance.", distance);
        }

        return DeliveryFeeResponse.builder()
                .distanceKm(distance)
                .deliveryFee(fee)
                .isFreeDelivery(isFree)
                .message(message)
                .build();
    }

    public double calculateDistance(double customerLat, double customerLng) {
        RestaurantConfig config = getConfig();
        return haversineDistance(config.getLatitude(), config.getLongitude(), customerLat, customerLng);
    }

    public BigDecimal calculateDeliveryFee(double distanceKm) {
        RestaurantConfig config = getConfig();
        if (distanceKm <= config.getFreeDeliveryRadiusKm()) {
            return BigDecimal.ZERO;
        }
        double extraKm = distanceKm - config.getFreeDeliveryRadiusKm();
        double feeAmount = config.getBaseDeliveryFee() + (config.getPerKmDeliveryFee() * extraKm);
        return BigDecimal.valueOf(feeAmount).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Haversine formula to calculate great-circle distance between two points.
     * @return distance in kilometers
     */
    public static double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth's radius in km

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private RestaurantConfig getConfig() {
        return configRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    RestaurantConfig defaultConfig = RestaurantConfig.defaultConfig();
                    return configRepository.save(defaultConfig);
                });
    }
}
