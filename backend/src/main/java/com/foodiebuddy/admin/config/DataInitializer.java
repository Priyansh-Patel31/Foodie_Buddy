package com.foodiebuddy.admin.config;

import com.foodiebuddy.admin.entity.*;
import com.foodiebuddy.admin.entity.enums.*;
import com.foodiebuddy.admin.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@ConditionalOnProperty(name = "app.data-initialization.enabled", havingValue = "true", matchIfMissing = true)
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final RestaurantConfigRepository configRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoTemplate mongoTemplate;

    // We store references to seeded users for order creation
    private User adminUser, managerUser, chefUser, deliveryUser;
    private User customerPriya, customerAmit, customerSneha, customerRaj, customerTom, customerHappy;

    @Override
    public void run(String... args) {
        log.info("Checking database for initialization...");

        log.info("Initializing seed data for single-restaurant ecosystem...");

        // 1. Restaurant Config
        if (configRepository.count() == 0) {
            RestaurantConfig config = RestaurantConfig.defaultConfig();
            configRepository.save(config);
            log.info("Restaurant config created: {}", config.getName());
        }

        // 2. Create Users (Admin + Staff + Customers)
        seedUsers();

        // 3. Create Categories
        Category starters = createCategory("Starters", 1);
        Category mainCourse = createCategory("Main Course", 2);
        Category breads = createCategory("Breads", 3);
        Category rice = createCategory("Rice & Biryani", 4);
        Category desserts = createCategory("Desserts", 5);
        Category beverages = createCategory("Beverages", 6);

        // 4. Create Inventory
        Inventory paneer = createInventory("Paneer", "kg", 15.0, 3.0);
        Inventory chicken = createInventory("Chicken", "kg", 30.0, 5.0);
        Inventory flour = createInventory("Wheat Flour", "kg", 25.0, 5.0);
        Inventory riceInv = createInventory("Basmati Rice", "kg", 40.0, 8.0);
        Inventory oil = createInventory("Cooking Oil", "liters", 20.0, 4.0);
        Inventory spices = createInventory("Spice Mix", "packets", 30.0, 5.0);
        Inventory milk = createInventory("Milk", "liters", 15.0, 3.0);
        Inventory sugar = createInventory("Sugar", "kg", 10.0, 2.0);
        Inventory cheese = createInventory("Cheese", "kg", 20.0, 3.0);
        Inventory dough = createInventory("Pizza Dough", "pieces", 50.0, 10.0);

        // 5. Create Menu Items
        createMenuItem("Paneer Tikka", "Chargrilled cottage cheese with spices", new BigDecimal("260"),
                starters.getId(), starters.getName(), true,
                "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80",
                List.of(new IngredientRequirement(paneer.getId(), "Paneer", 0.15),
                        new IngredientRequirement(spices.getId(), "Spice Mix", 0.5)));

        createMenuItem("Caesar Salad", "Crispy romaine with Caesar dressing and croutons", new BigDecimal("220"),
                starters.getId(), starters.getName(), true,
                "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=80",
                List.of());

        createMenuItem("Butter Chicken", "Rich tomato-based curry with tender chicken", new BigDecimal("380"),
                mainCourse.getId(), mainCourse.getName(), false,
                "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80",
                List.of(new IngredientRequirement(chicken.getId(), "Chicken", 0.25),
                        new IngredientRequirement(oil.getId(), "Cooking Oil", 0.05)));

        createMenuItem("Paneer Butter Masala", "Rich paneer in buttery gravy", new BigDecimal("299"),
                mainCourse.getId(), mainCourse.getName(), true,
                "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
                List.of(new IngredientRequirement(paneer.getId(), "Paneer", 0.2)));

        createMenuItem("Truffle Pasta", "Creamy black truffle pasta with parmesan", new BigDecimal("450"),
                mainCourse.getId(), mainCourse.getName(), true,
                "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=800&auto=format&fit=crop&q=80",
                List.of(new IngredientRequirement(cheese.getId(), "Cheese", 0.15)));

        createMenuItem("Margherita Pizza", "Classic stone-fired mozzarella pizza", new BigDecimal("300"),
                mainCourse.getId(), mainCourse.getName(), true,
                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80",
                List.of(new IngredientRequirement(dough.getId(), "Pizza Dough", 1.0),
                        new IngredientRequirement(cheese.getId(), "Cheese", 0.1)));

        createMenuItem("Garlic Bread", "Roasted garlic butter bread sticks", new BigDecimal("150"),
                breads.getId(), breads.getName(), true,
                "https://i1.wp.com/thetwincookingproject.net/wp-content/uploads/2020/05/Homemade-Dominos-Garlic-Bread_-scaled.jpg?fit=1707%2C2560&ssl=1",
                List.of(new IngredientRequirement(flour.getId(), "Wheat Flour", 0.1)));

        createMenuItem("Chicken Biryani", "Fragrant basmati rice with spiced chicken", new BigDecimal("349"),
                rice.getId(), rice.getName(), false,
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
                List.of(new IngredientRequirement(riceInv.getId(), "Basmati Rice", 0.3),
                        new IngredientRequirement(chicken.getId(), "Chicken", 0.2)));

        createMenuItem("Chocolate Lava Cake", "Warm molten chocolate cake with vanilla ice cream", new BigDecimal("280"),
                desserts.getId(), desserts.getName(), true,
                "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=80",
                List.of(new IngredientRequirement(sugar.getId(), "Sugar", 0.05)));

        createMenuItem("Masala Chai", "Authentic Indian spiced tea", new BigDecimal("60"),
                beverages.getId(), beverages.getName(), true,
                "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&auto=format&fit=crop&q=80",
                List.of(new IngredientRequirement(milk.getId(), "Milk", 0.1)));

        // 6. Seed Orders
        if (orderRepository.count() == 0) {
            seedOrders();
        }

        // 7. Seed Financial Transactions
        seedTransactions();

        log.info("Seed data verification completed successfully");
    }

    // ========================== USERS ==========================
    private void seedUsers() {
        adminUser = createStaff("Admin User", "admin@foodie.com", "Admin@123", Role.ROLE_ADMIN,
                new BigDecimal("80000"), 0);
        managerUser = createStaff("Restaurant Manager", "manager@foodie.com", "Manager@123", Role.ROLE_MANAGER,
                new BigDecimal("60000"), 1);
        chefUser = createStaff("Kitchen Staff", "kitchen@foodie.com", "Kitchen@123", Role.ROLE_CHEF,
                new BigDecimal("50000"), 4);
        deliveryUser = createStaff("Delivery Partner", "delivery@foodie.com", "Delivery@123", Role.ROLE_DELIVERY,
                new BigDecimal("25000"), 2);
        createStaff("Restaurant Staff", "staff@foodie.com", "Staff@123", Role.ROLE_WAITER,
                new BigDecimal("30000"), 0);
        createStaff("Sous Chef", "souschef@foodie.com", "password", Role.ROLE_CHEF,
                new BigDecimal("35000"), 1);
        createStaff("Rider Two", "rider2@foodie.com", "password", Role.ROLE_DELIVERY,
                new BigDecimal("22000"), 0);

        customerHappy = createCustomer("Happy Customer", "customer@foodie.com", "password", "9876543210",
                23.0300, 72.5100);
        customerPriya = createCustomer("Priya Sharma", "priya@gmail.com", "password", "9876543211",
                23.0500, 72.5300);
        customerAmit = createCustomer("Alice Smith", "alice@foodie.com", "password", "9876543212",
                23.0800, 72.5200);
        customerSneha = createCustomer("Sneha Iyer", "sneha@yahoo.com", "password", "9876543213",
                23.0200, 72.5400);
        customerTom = createCustomer("Tom Hanks", "tom@movie.com", "password", "9876543214",
                23.0600, 72.5150);
        customerRaj = createCustomer("Raj Patel", "raj@outlook.com", "password", "9876543215",
                23.0400, 72.5250);
    }

    // ========================== ORDERS ==========================
    private void seedOrders() {
        // Today's orders
        createOrder("ORD-001", customerHappy, "Block A, Tech Park", OrderStatus.DELIVERED,
                new BigDecimal("900"), new BigDecimal("350"), deliveryUser, managerUser,
                LocalDateTime.now().minusHours(3));
        createOrder("ORD-002", customerAmit, "7th Avenue, Sector 12", OrderStatus.PREPARING,
                new BigDecimal("450"), new BigDecimal("200"), chefUser, managerUser,
                LocalDateTime.now().minusHours(1));
        createOrder("ORD-005", customerPriya, "MG Road, Indira Nagar", OrderStatus.OUT_FOR_DELIVERY,
                new BigDecimal("780"), new BigDecimal("290"), deliveryUser, managerUser,
                LocalDateTime.now().minusMinutes(30));
        createOrder("ORD-006", customerRaj, "Jubilee Hills", OrderStatus.PREPARING,
                new BigDecimal("560"), new BigDecimal("180"), chefUser, managerUser,
                LocalDateTime.now().minusMinutes(15));

        // Yesterday
        createOrder("ORD-007", customerSneha, "Banjara Hills", OrderStatus.DELIVERED,
                new BigDecimal("1200"), new BigDecimal("500"), deliveryUser, managerUser,
                LocalDateTime.now().minusDays(1));
        createOrder("ORD-008", customerAmit, "7th Avenue, Sector 12", OrderStatus.DELIVERED,
                new BigDecimal("340"), new BigDecimal("120"), deliveryUser, adminUser,
                LocalDateTime.now().minusDays(2));

        // Older
        createOrder("ORD-003", customerHappy, "Block A, Tech Park", OrderStatus.DELIVERED,
                new BigDecimal("1550"), new BigDecimal("450"), deliveryUser, adminUser,
                LocalDateTime.of(2026, 2, 14, 19, 0));
        createOrder("ORD-004", customerTom, "Downtown Square", OrderStatus.DELIVERED,
                new BigDecimal("2100"), new BigDecimal("800"), deliveryUser, managerUser,
                LocalDateTime.of(2025, 12, 25, 20, 0));
        createOrder("ORD-009", customerPriya, "MG Road, Indira Nagar", OrderStatus.DELIVERED,
                new BigDecimal("680"), new BigDecimal("250"), deliveryUser, managerUser,
                LocalDateTime.of(2026, 3, 20, 13, 0));
        createOrder("ORD-010", customerTom, "Downtown Square", OrderStatus.DELIVERED,
                new BigDecimal("990"), new BigDecimal("380"), deliveryUser, managerUser,
                LocalDateTime.of(2026, 1, 15, 18, 0));
        createOrder("ORD-011", customerRaj, "Jubilee Hills", OrderStatus.DELIVERED,
                new BigDecimal("1450"), new BigDecimal("600"), deliveryUser, adminUser,
                LocalDateTime.of(2025, 11, 10, 12, 0));
        createOrder("ORD-012", customerSneha, "Banjara Hills", OrderStatus.DELIVERED,
                new BigDecimal("2800"), new BigDecimal("1100"), deliveryUser, managerUser,
                LocalDateTime.of(2025, 10, 5, 19, 0));

        log.info("Seeded 12 orders across multiple months.");
    }

    // ========================== TRANSACTIONS ==========================
    private void seedTransactions() {
        // Use the FinancialTransaction collection directly via MongoTemplate
        var txns = List.of(
                buildTxn("ORDER_REVENUE", "Order Revenue ORD-005", new BigDecimal("1200"), LocalDateTime.of(2026, 3, 28, 10, 0)),
                buildTxn("ORDER_REVENUE", "Order Revenue ORD-006", new BigDecimal("450"), LocalDateTime.of(2026, 3, 20, 12, 0)),
                buildTxn("PAYROLL", "Staff Payroll Execution (March)", new BigDecimal("-65000"), LocalDateTime.of(2026, 3, 1, 9, 0)),
                buildTxn("ORDER_REVENUE", "Bulk Catering Revenue", new BigDecimal("3200"), LocalDateTime.of(2026, 3, 5, 14, 0)),
                buildTxn("ORDER_REVENUE", "Order Revenue ORD-099", new BigDecimal("950"), LocalDateTime.of(2026, 2, 28, 11, 0)),
                buildTxn("PAYROLL", "Staff Payroll Execution (February)", new BigDecimal("-65000"), LocalDateTime.of(2026, 2, 25, 9, 0)),
                buildTxn("ORDER_REVENUE", "Valentine Day Special", new BigDecimal("2400"), LocalDateTime.of(2026, 2, 14, 20, 0)),
                buildTxn("ORDER_REVENUE", "Weekend Orders", new BigDecimal("800"), LocalDateTime.of(2026, 2, 7, 18, 0)),
                buildTxn("PAYROLL", "Staff Payroll Execution (January)", new BigDecimal("-64000"), LocalDateTime.of(2026, 1, 30, 9, 0)),
                buildTxn("ORDER_REVENUE", "New Year Bash Profits", new BigDecimal("15400"), LocalDateTime.of(2026, 1, 1, 22, 0)),
                buildTxn("PAYROLL", "Staff Payroll + Bonuses (December)", new BigDecimal("-70000"), LocalDateTime.of(2025, 12, 31, 9, 0)),
                buildTxn("ORDER_REVENUE", "Christmas Dinner Gala", new BigDecimal("45000"), LocalDateTime.of(2025, 12, 25, 21, 0)),
                buildTxn("ORDER_REVENUE", "Corporate Booking", new BigDecimal("12000"), LocalDateTime.of(2025, 12, 10, 14, 0)),
                buildTxn("ORDER_REVENUE", "Diwali Celebration Week", new BigDecimal("30000"), LocalDateTime.of(2025, 10, 20, 19, 0)),
                buildTxn("PAYROLL", "Staff Payroll Execution (October)", new BigDecimal("-60000"), LocalDateTime.of(2025, 10, 31, 9, 0)),
                buildTxn("ORDER_REVENUE", "Store Launch Year 1 Celebration", new BigDecimal("150000"), LocalDateTime.of(2025, 5, 1, 12, 0))
        );

        for (FinancialTransaction txn : txns) {
            Query query = Query.query(Criteria.where("transactionType").is(txn.getTransactionType())
                    .and("description").is(txn.getDescription())
                    .and("transactionDate").is(txn.getTransactionDate()));
            if (!mongoTemplate.exists(query, FinancialTransaction.class)) {
                mongoTemplate.save(txn);
            }
        }
        log.info("Financial transaction seed data verified.");
    }

    // ========================== HELPERS ==========================
    private User createStaff(String name, String email, String password, Role role,
                             BigDecimal baseSalary, int leavesTaken) {
        if (userRepository.existsByEmail(email)) {
            return userRepository.findByEmail(email).orElseThrow();
        }
        User u = User.builder()
                .name(name).email(email)
                .password(passwordEncoder.encode(password))
                .role(role).status(UserStatus.ACTIVE)
                .baseSalary(baseSalary)
                .leavesTakenThisMonth(leavesTaken)
                .build();
        u.onCreate();
        return userRepository.save(u);
    }

    private User createCustomer(String name, String email, String password, String phone,
                                Double lat, Double lng) {
        if (userRepository.existsByEmail(email)) {
            return userRepository.findByEmail(email).orElseThrow();
        }
        User u = User.builder()
                .name(name).email(email)
                .password(passwordEncoder.encode(password))
                .phone(phone).role(Role.ROLE_CUSTOMER)
                .status(UserStatus.ACTIVE)
                .latitude(lat).longitude(lng)
                .addressText("Ahmedabad, Gujarat")
                .baseSalary(BigDecimal.ZERO)
                .leavesTakenThisMonth(0)
                .build();
        u.onCreate();
        return userRepository.save(u);
    }

    private Category createCategory(String name, int order) {
        var existing = categoryRepository.findByName(name);
        if (existing.isPresent()) return existing.get();
        Category c = Category.builder().name(name).displayOrder(order).active(true).build();
        c.onCreate();
        return categoryRepository.save(c);
    }

    private Inventory createInventory(String name, String unit, Double stock, Double threshold) {
        var existing = inventoryRepository.findByName(name);
        if (existing.isPresent()) return existing.get();
        Inventory i = Inventory.builder()
                .name(name).unit(unit)
                .currentStock(stock).lowStockThreshold(threshold)
                .build();
        i.onCreate();
        return inventoryRepository.save(i);
    }

    private void createMenuItem(String name, String desc, BigDecimal price,
                                String catId, String catName, boolean isVeg,
                                String imageUrl, List<IngredientRequirement> ingredients) {
        if (menuItemRepository.findByName(name).isPresent()) return;
        MenuItem m = MenuItem.builder()
                .name(name).description(desc).price(price)
                .categoryId(catId).categoryName(catName)
                .isAvailable(true).isVegetarian(isVeg)
                .imageUrl(imageUrl)
                .ingredients(ingredients)
                .build();
        m.onCreate();
        menuItemRepository.save(m);
    }

    private void createOrder(String displayId, User customer, String address, OrderStatus status,
                             BigDecimal charge, BigDecimal profit, User worker, User manager,
                             LocalDateTime createdAt) {
        Order order = Order.builder()
                .customerId(customer.getId())
                .customerName(customer.getName())
                .customerAddress(address)
                .status(status)
                .customerCharge(charge)
                .totalAmount(charge)
                .subtotal(charge)
                .deliveryFee(BigDecimal.ZERO)
                .calculatedProfit(profit)
                .assignedDeliveryUserId(worker.getId())
                .assignedDeliveryUserName(worker.getName())
                .managingManagerId(manager.getId())
                .managingManagerName(manager.getName())
                .createdAt(createdAt)
                .build();

        if (status == OrderStatus.DELIVERED) {
            order.setDeliveredAt(createdAt.plusMinutes(45));
        }

        orderRepository.save(order);
    }

    private FinancialTransaction buildTxn(String type, String description, BigDecimal amount,
                                          LocalDateTime date) {
        return FinancialTransaction.builder()
                .transactionType(type)
                .description(description)
                .amount(amount)
                .transactionDate(date)
                .build();
    }
}
