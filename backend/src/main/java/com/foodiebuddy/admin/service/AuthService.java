package com.foodiebuddy.admin.service;

import com.foodiebuddy.admin.dto.*;
import com.foodiebuddy.admin.entity.User;
import com.foodiebuddy.admin.entity.enums.Role;
import com.foodiebuddy.admin.entity.enums.UserStatus;
import com.foodiebuddy.admin.exception.BadRequestException;
import com.foodiebuddy.admin.exception.ConflictException;
import com.foodiebuddy.admin.repository.UserRepository;
import com.foodiebuddy.admin.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Authentication failed for email {}", email);
            throw new org.springframework.security.authentication.BadCredentialsException("Invalid credentials");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            log.warn("Authentication denied for suspended account {}", email);
            throw new org.springframework.security.authentication.DisabledException("Account is suspended");
        }

        String token = tokenProvider.generateToken(user);
        log.info("Authentication succeeded for user {} with role {}", email, user.getRole());

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public LoginResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.ROLE_CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();
        user.onCreate();
        userRepository.save(user);

        String token = tokenProvider.generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public LoginResponse createStaff(CreateStaffRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email is already registered");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + request.getRole());
        }

        if (role == Role.ROLE_CUSTOMER) {
            throw new BadRequestException("Cannot create customer via staff endpoint");
        }

        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .status(UserStatus.ACTIVE)
                .build();
        user.onCreate();
        userRepository.save(user);

        log.info("Staff created: {} with role {}", user.getEmail(), role);

        return LoginResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
