package com.foodiebuddy.admin.config;

import com.foodiebuddy.admin.entity.*;
import com.foodiebuddy.admin.entity.enums.*;
import com.foodiebuddy.admin.repository.*;
import com.foodiebuddy.admin.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository; 
    private final ComplaintRepository complaintRepository;
    private final CommissionRepository commissionRepository;
    private final PasswordEncoder passwordEncoder; 

    @Override
    public void run(String... args) {
        if (adminRepository.count() > 0) {
            log.info("Data already initialized, skipping...");
            return;
        }

        log.info("Initializing seed data...");

        // Create admin
        Admin admin = Admin.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .role("ADMIN")
                .build();
        adminRepository.save(admin);

        // Create categories
        List<Category> categories = List.of(
                Category.builder().name("Pizza").active(true).build(),
                Category.builder().name("Burger").active(true).build(),
                Category.builder().name("Drinks").active(true).build(),
                Category.builder().name("Desserts").active(true).build(),
                Category.builder().name("Chinese").active(true).build(),
                Category.builder().name("South Indian").active(true).build(),
                Category.builder().name("North Indian").active(true).build(),
                Category.builder().name("Italian").active(true).build()
        );
        categoryRepository.saveAll(categories);

        // Create users
        List<User> users = List.of(
                User.builder().name("Rahul Sharma").email("rahul@example.com").phone("9876543210").address("Mumbai, MH").status(UserStatus.ACTIVE).build(),
                User.builder().name("Priya Patel").email("priya@example.com").phone("9876543211").address("Delhi, DL").status(UserStatus.ACTIVE).build(),
                User.builder().name("Amit Kumar").email("amit@example.com").phone("9876543212").address("Bangalore, KA").status(UserStatus.ACTIVE).build(),
                User.builder().name("Sneha Reddy").email("sneha@example.com").phone("9876543213").address("Hyderabad, TG").status(UserStatus.ACTIVE).build(),
                User.builder().name("Vikram Singh").email("vikram@example.com").phone("9876543214").address("Pune, MH").status(UserStatus.SUSPENDED).build(),
                User.builder().name("Neha Gupta").email("neha@example.com").phone("9876543215").address("Chennai, TN").status(UserStatus.ACTIVE).build(),
                User.builder().name("Arjun Verma").email("arjun@example.com").phone("9876543216").address("Kolkata, WB").status(UserStatus.ACTIVE).build(),
                User.builder().name("Kavita Nair").email("kavita@example.com").phone("9876543217").address("Kochi, KL").status(UserStatus.ACTIVE).build()
        );
        userRepository.saveAll(users);

        // Create restaurants
        List<Restaurant> restaurants = List.of(
                Restaurant.builder().name("Pizza Palace").ownerName("Rajesh M").email("pizza@palace.com").phone("9112233441").location("Mumbai").latitude(19.076).longitude(72.877).status(RestaurantStatus.APPROVED).commissionRate(10.0).build(),
                Restaurant.builder().name("Burger Barn").ownerName("Suresh K").email("burger@barn.com").phone("9112233442").location("Delhi").latitude(28.644).longitude(77.216).status(RestaurantStatus.APPROVED).commissionRate(12.0).build(),
                Restaurant.builder().name("Dosa House").ownerName("Lakshmi S").email("dosa@house.com").phone("9112233443").location("Bangalore").latitude(12.971).longitude(77.594).status(RestaurantStatus.APPROVED).commissionRate(8.0).build(),
                Restaurant.builder().name("Tandoori Nights").ownerName("Ramesh P").email("tandoori@nights.com").phone("9112233444").location("Hyderabad").latitude(17.385).longitude(78.486).status(RestaurantStatus.PENDING).commissionRate(10.0).build(),
                Restaurant.builder().name("Dragon Wok").ownerName("Wei Lin").email("dragon@wok.com").phone("9112233445").location("Pune").latitude(18.520).longitude(73.856).status(RestaurantStatus.PENDING).commissionRate(15.0).build(),
                Restaurant.builder().name("Cafe Mocha").ownerName("Anita B").email("cafe@mocha.com").phone("9112233446").location("Chennai").latitude(13.082).longitude(80.270).status(RestaurantStatus.APPROVED).commissionRate(10.0).build(),
                Restaurant.builder().name("Royal Biryani").ownerName("Fahad A").email("royal@biryani.com").phone("9112233447").location("Kolkata").latitude(22.572).longitude(88.363).status(RestaurantStatus.SUSPENDED).commissionRate(10.0).build(),
                Restaurant.builder().name("Sweet Dreams").ownerName("Meena R").email("sweet@dreams.com").phone("9112233448").location("Kochi").latitude(9.931).longitude(76.267).status(RestaurantStatus.APPROVED).commissionRate(10.0).build()
        );
        restaurantRepository.saveAll(restaurants);

        // Create orders with commission logic
        Random random = new Random(42);
        List<Restaurant> approvedRestaurants = restaurantRepository.findByStatus(RestaurantStatus.APPROVED);
        List<User> allUsers = userRepository.findAll();

        for (int i = 0; i < 50; i++) {
            User user = allUsers.get(random.nextInt(allUsers.size()));
            Restaurant restaurant = approvedRestaurants.get(random.nextInt(approvedRestaurants.size()));
            BigDecimal totalAmount = BigDecimal.valueOf(200 + random.nextInt(800));
            double distance = 0.5 + random.nextDouble() * 9.5; // 0.5 to 10 km

            BigDecimal[] commission = OrderService.calculateCommission(totalAmount, distance, restaurant.getCommissionRate());

            OrderStatus[] statuses = OrderStatus.values();
            OrderStatus status = statuses[random.nextInt(statuses.length)];

            Order order = Order.builder()
                    .user(user)
                    .restaurant(restaurant)
                    .totalAmount(totalAmount)
                    .distanceKm(Math.round(distance * 10.0) / 10.0)
                    .commissionAmount(commission[0])
                    .platformRevenue(commission[1])
                    .restaurantRevenue(commission[2])
                    .status(status)
                    .build();
            // Set created_at to random time in last 30 days
            order.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(30)).minusHours(random.nextInt(24)));
            orderRepository.save(order);

            // Create commission record
            Commission commissionRecord = Commission.builder()
                    .order(order)
                    .restaurant(restaurant)
                    .amount(commission[0])
                    .waived(distance <= 2.0)
                    .build();
            commissionRepository.save(commissionRecord);
        }

        // Create complaints
        List<Order> allOrders = orderRepository.findAll();
        for (int i = 0; i < 8; i++) {
            Order order = allOrders.get(random.nextInt(allOrders.size()));
            String[] descriptions = {
                    "Order arrived cold and stale",
                    "Wrong items delivered",
                    "Delivery was more than 1 hour late",
                    "Missing items in order",
                    "Food quality was very poor",
                    "Rider was rude during delivery",
                    "Packaging was damaged",
                    "Charged extra but items missing"
            };
            ComplaintStatus[] cs = {ComplaintStatus.OPEN, ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED};
            Complaint complaint = Complaint.builder()
                    .user(order.getUser())
                    .order(order)
                    .description(descriptions[i])
                    .status(cs[random.nextInt(cs.length)])
                    .build();
            complaintRepository.save(complaint);
        }

        log.info("Seed data initialized successfully! Admin credentials: admin / admin123");
    }
}
