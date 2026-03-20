package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.RestaurantDTO;
import com.foodiebuddy.admin.entity.Restaurant;
import com.foodiebuddy.admin.entity.enums.RestaurantStatus;
import com.foodiebuddy.admin.exception.ResourceNotFoundException;
import com.foodiebuddy.admin.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public Page<RestaurantDTO> getAllRestaurants(Pageable pageable) {
        return restaurantRepository.findAll(pageable).map(this::toDTO);
    }

    public Page<RestaurantDTO> getByStatus(RestaurantStatus status, Pageable pageable) {
        return restaurantRepository.findByStatus(status, pageable).map(this::toDTO);
    }

    public Page<RestaurantDTO> searchRestaurants(String search, Pageable pageable) {
        return restaurantRepository.searchRestaurants(search, pageable).map(this::toDTO);
    }

    public RestaurantDTO getById(String id) {
        return toDTO(findById(id));
    }

    @Transactional
    public RestaurantDTO approve(String id) {
        Restaurant restaurant = findById(id);
        restaurant.setStatus(RestaurantStatus.APPROVED);
        log.info("Restaurant {} approved", id);
        return toDTO(restaurantRepository.save(restaurant));
    }

    @Transactional
    public RestaurantDTO reject(String id) {
        Restaurant restaurant = findById(id);
        restaurant.setStatus(RestaurantStatus.REJECTED);
        log.info("Restaurant {} rejected", id);
        return toDTO(restaurantRepository.save(restaurant));
    }

    @Transactional
    public RestaurantDTO suspend(String id) {
        Restaurant restaurant = findById(id);
        restaurant.setStatus(RestaurantStatus.SUSPENDED);
        log.info("Restaurant {} suspended", id);
        return toDTO(restaurantRepository.save(restaurant));
    }

    @Transactional
    public void delete(String id) {
        Restaurant restaurant = findById(id);
        restaurantRepository.delete(restaurant);
        log.info("Restaurant {} deleted", id);
    }

    private Restaurant findById(String id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }

    private RestaurantDTO toDTO(Restaurant r) {
        return RestaurantDTO.builder()
                .id(r.getId())
                .name(r.getName())
                .ownerName(r.getOwnerName())
                .email(r.getEmail())
                .phone(r.getPhone())
                .location(r.getLocation())
                .latitude(r.getLatitude())
                .longitude(r.getLongitude())
                .status(r.getStatus().name())
                .commissionRate(r.getCommissionRate())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
