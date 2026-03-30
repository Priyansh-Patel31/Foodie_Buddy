# Foodie-Buddy - Food Ordering Platform

A full-stack food ordering application with customer frontend, admin dashboard, and backend API.

## Project Structure

```
Foodie-Buddy/
├── frontend/              # Customer-facing React application
├── admin-frontend/        # Admin dashboard React application  
├── backend/               # Spring Boot REST API
└── .github/              # GitHub configuration
```

## Prerequisites

- **Java 17+** (for backend)
- **Node.js 16+** and **npm** (for frontends)
- **MongoDB** (for database)
- Git (for version control)

## Technology Stack

### Backend
- **Spring Boot 3.4.3** - REST API framework
- **MongoDB** - Database
- **Spring Security** - Authentication/Authorization
- **JWT** - Token-based authentication
- **Swagger/OpenAPI** - API documentation
- **Maven** - Build tool

### Frontend (Customer)
- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Admin Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Recharts** - Charts/Analytics
- **React Query** - Data fetching
- **Axios** - HTTP client

## Setup & Installation

### 1. Backend Setup

```bash
cd backend

# Install dependencies (Maven will download automatically)
./mvnw clean install

# Configure MongoDB connection if needed
# Edit: src/main/resources/application.properties
# spring.data.mongodb.uri=mongodb://localhost:27017/food_admin

# Run the application
./mvnw spring-boot:run
```

The backend will start at `http://localhost:8080`
- API: `http://localhost:8080/api/admin`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### 2. Frontend (Customer) Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Admin Frontend Setup

```bash
cd admin-frontend

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env

# Start development server
npm run dev
```

The admin frontend will be available at `http://localhost:5174`

## Configuration

### Backend Configuration
- Database: `application.properties` - Change MongoDB URI if needed
- JWT: Configure `jwt.secret` and `jwt.expiration` in properties
- Server Port: Default 8080 (configurable in `application.properties`)

### Frontend Configuration
- API URL: Set `VITE_API_URL` in `.env` (default: `/api`)
- Proxy: Development proxy configured in `vite.config.ts`

### Admin Frontend Configuration
- API endpoint: Hardcoded as `/api/admin` in `services/api.ts`
- Development proxy: Routes `/api` to `http://127.0.0.1:8080`

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 3 - Admin Frontend:**
```bash
cd admin-frontend
npm install
npm run dev
```

Then access:
- Customer App: `http://localhost:5173`
- Admin Dashboard: `http://localhost:5174`
- API Documentation: `http://localhost:8080/swagger-ui.html`

### Production Build

**Backend:**
```bash
cd backend
./mvnw clean package
java -jar target/admin-backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Contents in dist/ folder - serve with your web server
```

**Admin Frontend:**
```bash
cd admin-frontend
npm run build
# Contents in dist/ folder - serve with your web server
```

## API Structure

### Authentication
- **Endpoint:** `/api/admin/login`
- **Method:** POST
- **Body:** `{ "username": "string", "password": "string" }`
- **Response:** `{ "token": "JWT_TOKEN" }`

### Protected Endpoints
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Main API Endpoints
- `/api/admin/dashboard` - Dashboard statistics
- `/api/admin/restaurants` - Restaurant management
- `/api/admin/users` - User management
- `/api/admin/orders` - Order management
- `/api/admin/categories` - Category management
- `/api/admin/revenue` - Revenue analytics
- `/api/admin/complaints` - Complaint management

## Database

MongoDB collections used:
- `admins` - Admin users
- `restaurants` - Restaurant information
- `users` - Customer users
- `orders` - Customer orders
- `order_items` - Order line items
- `menu_items` - Restaurant menu items
- `categories` - Food categories
- `payments` - Payment records
- `commissions` - Restaurant commissions
- `complaints` - Customer complaints

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=/api
```

### Admin Frontend (.env)
```
# Optional - API uses hardcoded /api/admin path
```

### Backend (application.properties)
```
spring.data.mongodb.uri=mongodb://localhost:27017/food_admin
jwt.secret=<generate-secure-secret>
jwt.expiration=86400000
server.port=8080
```

## Development Commands

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Admin Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend
```bash
./mvnw spring-boot:run           # Run application
./mvnw clean install             # Build project
./mvnw test                       # Run tests
./mvnw spring-boot:build-image   # Build Docker image
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally on port 27017
- Or update `spring.data.mongodb.uri` in `application.properties`

### Port Already in Use
- Backend: Change `server.port` in `application.properties`
- Frontend: Change port in `vite.config.ts` → `server.port`
- Admin Frontend: Change port in `vite.config.ts` → `server.port`

### CORS Issues
- CORS is configured in backend SecurityConfig
- Ensure origins are properly configured for production

### Frontend Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist && npm run build`

## Security Considerations

- Enable HTTPS in production
- Use strong JWT secrets
- Implement rate limiting
- Add input validation
- Use environment variables for sensitive data
- Regular security updates for dependencies

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Create Pull Request

## License

[Add your license here]

## Support

For issues and questions, please create an issue in the GitHub repository.
