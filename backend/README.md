# Foodie-Buddy Admin Backend

Spring Boot REST API backend for the Foodie-Buddy food ordering platform. Provides endpoints for admin panel operations, including restaurant management, user management, order tracking, revenue analytics, and complaint handling.

## Technology Stack

- **Spring Boot 3.4.3** - REST API framework
- **Java 17** - Programming language
- **MongoDB** - NoSQL database
- **Spring Security** - Authentication and authorization
- **JWT (JJWT)** - Token-based authentication
- **Swagger/OpenAPI** - API documentation
- **Lombok** - Code generation and annotation processing
- **Maven** - Build tool and dependency management

## Prerequisites

- Java 17+
- Maven 3.8+ (or use Maven wrapper ./mvnw)
- MongoDB 4.4+ (running locally or accessible via network)
- Git (for version control)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
# Using Maven wrapper (recommended - no Maven installation needed)
./mvnw clean install

# Or using installed Maven
mvn clean install
```

## Configuration

All configuration is managed through `src/main/resources/application.properties`

### Key Configuration Properties

```properties
# Application
spring.application.name=admin-backend
server.port=8080

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/food_admin
spring.data.mongodb.auto-index-creation=true

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000  # 24 hours in milliseconds

# Swagger/OpenAPI
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

### Environment-Specific Configuration

Create additional files for different environments:
- `application-dev.properties` - Development settings
- `application-prod.properties` - Production settings
- `application-test.properties` - Test settings

Activate with: `spring.profiles.active=dev`

## Development

### Starting the Application

```bash
# Using Maven Wrapper
./mvnw spring-boot:run

# Or with installed Maven
mvn spring-boot:run

# Or build and run the JAR
./mvnw clean package
java -jar target/admin-backend-0.0.1-SNAPSHOT.jar
```

Server will start on: `http://localhost:8080`

### API Documentation

Once the server is running, access Swagger UI:
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`

### Development Tools

```bash
# Run tests
./mvnw test

# Run with debug information
./mvnw spring-boot:run -Dspring-boot.run.arguments="--debug"

# Build without running tests
./mvnw clean package -DskipTests

# Check dependencies
./mvnw dependency:tree
```

## Project Structure

```
src/
├── main/
│   ├── java/com/foodiebuddy/admin/
│   │   ├── AdminBackendApplication.java       # Main Spring Boot application
│   │   ├── config/                            # Configuration classes
│   │   │   ├── CorsConfig.java
│   │   │   ├── DataInitializer.java
│   │   │   ├── OpenApiConfig.java
│   │   │   └── SecurityConfig.java
│   │   ├── controller/                        # REST controllers
│   │   │   ├── AuthController.java
│   │   │   ├── CategoryController.java
│   │   │   ├── ComplaintController.java
│   │   │   ├── DashboardController.java
│   │   │   ├── OrderController.java
│   │   │   ├── RestaurantController.java
│   │   │   ├── RevenueController.java
│   │   │   └── UserController.java
│   │   ├── dto/                               # Data Transfer Objects
│   │   │   ├── ApiResponse.java
│   │   │   ├── CategoryDTO.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── LoginResponse.java
│   │   │   └── ... (other DTOs)
│   │   ├── entity/                            # JPA/MongoDB entities
│   │   │   ├── Admin.java
│   │   │   ├── Category.java
│   │   │   ├── Complaint.java
│   │   │   ├── Order.java
│   │   │   ├── Restaurant.java
│   │   │   ├── User.java
│   │   │   └── enums/                         # Enum types
│   │   ├── exception/                         # Custom exceptions
│   │   │   ├── BadRequestException.java
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   └── ResourceNotFoundException.java
│   │   ├── repository/                        # MongoDB repositories
│   │   │   ├── AdminRepository.java
│   │   │   ├── CategoryRepository.java
│   │   │   ├── OrderRepository.java
│   │   │   └── ... (other repositories)
│   │   ├── security/                          # Security classes
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── JwtTokenProvider.java
│   │   │   └── AdminUserDetailsService.java
│   │   └── service/                           # Business logic services
│   │       ├── AdminAuthService.java
│   │       ├── CategoryService.java
│   │       ├── OrderService.java
│   │       └── ... (other services)
│   └── resources/
│       ├── application.properties              # Configuration
│       └── application-*.properties            # Environment-specific configs
└── test/
    └── java/com/foodiebuddy/admin/            # Unit tests
```

## API Endpoints

### Authentication

**Login**
```
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```

### Protected Endpoints

All admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Admin Endpoints

#### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

#### Restaurants
- `GET /api/admin/restaurants` - List all restaurants
- `GET /api/admin/restaurants/{id}` - Get restaurant details
- `POST /api/admin/restaurants` - Create restaurant
- `PUT /api/admin/restaurants/{id}` - Update restaurant
- `DELETE /api/admin/restaurants/{id}` - Delete restaurant

#### Users
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/{id}` - Get user details
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

#### Orders
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/orders/{id}` - Get order details
- `PUT /api/admin/orders/{id}/status` - Update order status

#### Categories
- `GET /api/admin/categories` - List all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/{id}` - Update category
- `DELETE /api/admin/categories/{id}` - Delete category

#### Revenue
- `GET /api/admin/revenue` - Get revenue statistics
- `GET /api/admin/revenue/daily` - Daily revenue
- `GET /api/admin/revenue/restaurant/{id}` - Restaurant revenue

#### Complaints
- `GET /api/admin/complaints` - List complaints
- `GET /api/admin/complaints/{id}` - Get complaint details
- `PUT /api/admin/complaints/{id}/status` - Update complaint status

## Database

### MongoDB Collections

**admins**
- Admin user accounts
- Fields: _id, username, password (bcrypted), email, role, createdAt

**restaurants**
- Restaurant information
- Fields: _id, name, description, address, phone, email, status, owner, commission, rating, createdAt

**users**
- Customer user accounts
- Fields: _id, name, email, phone, password (bcrypted), address, status, createdAt

**orders**
- Customer orders
- Fields: _id, orderNumber, customerId, restaurantId, items, totalAmount, status, paymentStatus, createdAt

**order_items**
- Individual items in orders
- Fields: _id, orderId, menuItemId, quantity, price, specialRequests

**menu_items**
- Restaurant menu items
- Fields: _id, restaurantId, name, description, category, price, imageUrl, ingredients, availability

**categories**
- Food categories
- Fields: _id, name, description, imageUrl, active, createdAt

**payments**
- Payment records
- Fields: _id, orderId, amount, method, status, transactionId, createdAt

**commissions**
- Restaurant commission tracking
- Fields: _id, restaurantId, amount, period, status, createdAt

**complaints**
- Customer complaints
- Fields: _id, userId, orderId, subject, description, status, resolution, createdAt

## Security

### Authentication Flow

1. User logs in with username/password to `/api/admin/login`
2. Backend verifies credentials against hashed password
3. JWT token is generated with expiration time
4. Client stores token in localStorage
5. Token is sent with every request in `Authorization: Bearer <token>` header
6. Backend validates token signature and expiration
7. On expired or invalid token, return 401 Unauthorized

### Password Security

- Passwords are hashed using BCrypt algorithm
- Minimum password requirements enforced
- Never store plain text passwords
- Reset password functionality available

### CORS Configuration

- CORS is configured in `CorsConfig.java`
- Allows requests from frontend and admin-frontend
- Configure allowed origins for production

## Error Handling

Standard error response format:
```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2026-03-29T10:30:00Z",
  "status": 400
}
```

### HTTP Status Codes
- `200 OK` - Successful request
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authorization failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Building for Production

### Build JAR File
```bash
./mvnw clean package
```

Output: `target/admin-backend-0.0.1-SNAPSHOT.jar`

### Build Docker Image
```bash
./mvnw spring-boot:build-image
```

### Run JAR File
```bash
java -jar target/admin-backend-0.0.1-SNAPSHOT.jar
```

### Run with Custom Properties
```bash
java -jar target/admin-backend-0.0.1-SNAPSHOT.jar \
  --spring.data.mongodb.uri=mongodb://prod-server:27017/food_admin \
  --jwt.secret=your-secret-key \
  --server.port=8080
```

## Testing

### Run All Tests
```bash
./mvnw test
```

### Run Specific Test
```bash
./mvnw test -Dtest=CategoryServiceTest
```

### Generate Test Report
```bash
./mvnw test jacoco:report
# Report: target/site/jacoco/index.html
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED

Solution:
1. Ensure MongoDB is running locally
2. Check if listening on port 27017
3. Update spring.data.mongodb.uri in application.properties
```

### Port Already in Use
```
Error: Address already in use

Solution:
1. Change server.port in application.properties
2. Or kill process on port 8080: lsof -ti:8080 | xargs kill -9
```

### JWT Token Expired
```
Automatically handled:
1. Client should refresh token
2. Or redirect to login
```

### CORS Issues
```
Solution:
1. Check CorsConfig.java
2. Verify frontend URL is in allowed origins
3. Ensure wildcard (*) is not used in production
```

## Dependencies

Key dependencies (see pom.xml for complete list):

- `spring-boot-starter-web` - Web framework
- `spring-boot-starter-data-mongodb` - MongoDB persistence
- `spring-boot-starter-security` - Security
- `spring-boot-starter-validation` - Input validation
- `jjwt` - JWT token handling
- `lombok` - Code generation
- `springdoc-openapi` - Swagger/OpenAPI documentation
- `spring-security-test` - Security testing

## Performance Considerations

1. **Database Indexing** - Create indexes on frequently queried fields
2. **Caching** - Use Spring Cache for frequently accessed data
3. **Pagination** - Implement pagination for large result sets
4. **Connection Pooling** - MongoDB connection pool configured automatically
5. **Lazy Loading** - Use lazy loading for relationships

## Monitoring & Logging

### Logging Configuration

Logs are output to console and can be configured in application.properties:
```properties
logging.level.com.foodiebuddy=DEBUG
logging.level.org.springframework.web=INFO
```

### Health Check Endpoint (if actuator added)
```
GET /actuator/health
```

## Related Documentation

- [Main Project README](../README.md)
- Customer Frontend: [../frontend/README.md](../frontend/README.md)
- Admin Frontend: [../admin-frontend/README.md](../admin-frontend/README.md)

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and test locally
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/feature-name`
5. Create Pull Request

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce
