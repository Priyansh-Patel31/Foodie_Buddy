package com.foodiebuddy.admin.config;

import com.foodiebuddy.admin.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodiebuddy.admin.dto.ApiResponse;
import org.springframework.http.MediaType;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ObjectMapper objectMapper;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(org.springframework.security.config.Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(org.springframework.http.HttpMethod.POST,
                        "/api/auth/login", "/api/auth/register").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                // WebSocket & delivery fee are public
                .requestMatchers("/ws/**", "/api/delivery/fee").permitAll()

                // Customer endpoints
                .requestMatchers("/api/orders/place", "/api/orders/my/**").hasAuthority("ROLE_CUSTOMER")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/orders/*/rate").hasAuthority("ROLE_CUSTOMER")

                // Manager endpoints (dedicated order management flow)
                .requestMatchers("/api/manager/**").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")

                // Admin read endpoints — also accessible by Manager for their dashboard
                .requestMatchers(org.springframework.http.HttpMethod.GET,
                        "/api/admin/menu", "/api/admin/orders", "/api/admin/users",
                        "/api/admin/staff", "/api/admin/customers",
                        "/api/admin/financials/transactions", "/api/admin/dashboard", "/api/admin/config")
                    .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                // Manager can toggle menu availability and manage active delivery assignments
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/admin/menu/*/toggle").hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/admin/orders/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/admin/orders/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                // Admin-only write endpoints
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                // Staff role-based endpoints
                .requestMatchers("/api/kitchen/**").hasAuthority("ROLE_CHEF")
                .requestMatchers("/api/waiter/**").hasAuthority("ROLE_WAITER")
                .requestMatchers("/api/cleaner/**").hasAuthority("ROLE_CLEANER")
                .requestMatchers("/api/delivery/my-orders", "/api/delivery/pickup/**",
                        "/api/delivery/start/**", "/api/delivery/deliver/**").hasAuthority("ROLE_DELIVERY")

                .anyRequest().authenticated()
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setStatus(401);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    objectMapper.writeValue(response.getOutputStream(),
                            ApiResponse.error("Authentication is required"));
                })
                .accessDeniedHandler((request, response, exception) -> {
                    response.setStatus(403);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    objectMapper.writeValue(response.getOutputStream(),
                            ApiResponse.error("You do not have permission to access this resource"));
                }))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
