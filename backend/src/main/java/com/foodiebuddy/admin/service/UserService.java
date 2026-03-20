package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.UserDTO;
import com.foodiebuddy.admin.entity.User;
import com.foodiebuddy.admin.entity.enums.UserStatus;
import com.foodiebuddy.admin.exception.ResourceNotFoundException;
import com.foodiebuddy.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toDTO);
    }

    public Page<UserDTO> searchUsers(String search, Pageable pageable) {
        return userRepository.searchUsers(search, pageable).map(this::toDTO);
    }

    public UserDTO getById(String id) {
        return toDTO(findById(id));
    }

    @Transactional
    public UserDTO suspend(String id) {
        User user = findById(id);
        user.setStatus(UserStatus.SUSPENDED);
        log.info("User {} suspended", id);
        return toDTO(userRepository.save(user));
    }

    @Transactional
    public void delete(String id) {
        User user = findById(id);
        userRepository.delete(user);
        log.info("User {} deleted", id);
    }

    private User findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private UserDTO toDTO(User u) {
        return UserDTO.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .address(u.getAddress())
                .status(u.getStatus().name())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
