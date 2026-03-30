# Foodie-Buddy Project Structure

Complete guide to the project directory structure and file organization.

## Overview

```
Foodie-Buddy/
├── README.md                 # Main project documentation
├── SETUP.md                  # Complete setup guide
├── STRUCTURE.md              # This file - structure documentation
├── .gitignore               # Git ignore file
├── .github/                 # GitHub configuration
│   └── workflows/           # CI/CD workflows
├── backend/                 # Spring Boot REST API
├── frontend/                # Customer React app
├── admin-frontend/          # Admin React dashboard
└── .vscode/                # VS Code settings (workspace)
```

## Detailed Structure

### Root Directory Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation with overview and quick start |
| `SETUP.md` | Comprehensive setup guide for development environment |
| `STRUCTURE.md` | This file - project structure reference |
| `.gitignore` | Git configuration to exclude files from version control |

### Root Directories

#### `.github/`
GitHub configuration folder
- `workflows/` - CI/CD pipeline definitions
- Contains GitHub Actions workflows for automated testing and deployment

#### `.vscode/`
VS Code workspace configuration
- `settings.json` - Workspace settings
- `extensions.json` - Recommended extensions

---

## Backend Structure

```
backend/
├── .mvn/                      # Maven wrapper files
│   └── wrapper/
│       ├── maven-wrapper.jar
│       └── maven-wrapper.properties
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/foodiebuddy/admin/
│   │   │       ├── AdminBackendApplication.java      # Main Spring Boot app
│   │   │       ├── config/                           # Configuration classes
│   │   │       │   ├── CorsConfig.java              # CORS configuration
│   │   │       │   ├── DataInitializer.java         # Initialize sample data
│   │   │       │   ├── OpenApiConfig.java           # Swagger/OpenAPI config
│   │   │       │   └── SecurityConfig.java          # Spring Security config
│   │   │       ├── controller/                       # REST API Controllers
│   │   │       │   ├── AuthController.java          # Authentication endpoints
│   │   │       │   ├── CategoryController.java      # Category endpoints
│   │   │       │   ├── ComplaintController.java     # Complaint endpoints
│   │   │       │   ├── DashboardController.java     # Dashboard endpoints
│   │   │       │   ├── OrderController.java         # Order endpoints
│   │   │       │   ├── RestaurantController.java    # Restaurant endpoints
│   │   │       │   ├── RevenueController.java       # Revenue endpoints
│   │   │       │   └── UserController.java          # User endpoints
│   │   │       ├── dto/                              # Data Transfer Objects
│   │   │       │   ├── ApiResponse.java             # Standard API response wrapper
│   │   │       │   ├── CategoryDTO.java
│   │   │       │   ├── ComplaintDTO.java
│   │   │       │   ├── DailyRevenueDTO.java
│   │   │       │   ├── DashboardStatsDTO.java
│   │   │       │   ├── LoginRequest.java
│   │   │       │   ├── LoginResponse.java
│   │   │       │   ├── OrderDTO.java
│   │   │       │   ├── RestaurantDTO.java
│   │   │       │   ├── RestaurantRevenueDTO.java
│   │   │       │   ├── RevenueStatsDTO.java
│   │   │       │   └── UserDTO.java
│   │   │       ├── entity/                           # JPA/MongoDB Entities
│   │   │       │   ├── Admin.java                   # Admin user entity
│   │   │       │   ├── Category.java                # Food category entity
│   │   │       │   ├── Commission.java              # Restaurant commission
│   │   │       │   ├── Complaint.java               # Customer complaint
│   │   │       │   ├── MenuItem.java                # Restaurant menu item
│   │   │       │   ├── Order.java                   # Customer order
│   │   │       │   ├── OrderItem.java               # Order line item
│   │   │       │   ├── Payment.java                 # Payment record
│   │   │       │   ├── Restaurant.java              # Restaurant info
│   │   │       │   ├── User.java                    # Customer user
│   │   │       │   └── enums/                        # Enum types
│   │   │       │       ├── ComplaintStatus.java
│   │   │       │       ├── OrderStatus.java
│   │   │       │       ├── PaymentStatus.java
│   │   │       │       ├── RestaurantStatus.java
│   │   │       │       └── UserStatus.java
│   │   │       ├── exception/                        # Custom Exceptions
│   │   │       │   ├── BadRequestException.java
│   │   │       │   ├── GlobalExceptionHandler.java  # Global exception handler
│   │   │       │   └── ResourceNotFoundException.java
│   │   │       ├── repository/                       # MongoDB Repositories
│   │   │       │   ├── AdminRepository.java
│   │   │       │   ├── CategoryRepository.java
│   │   │       │   ├── CommissionRepository.java
│   │   │       │   ├── ComplaintRepository.java
│   │   │       │   ├── MenuItemRepository.java
│   │   │       │   ├── OrderRepository.java
│   │   │       │   ├── PaymentRepository.java
│   │   │       │   ├── RestaurantRepository.java
│   │   │       │   └── UserRepository.java
│   │   │       ├── security/                         # Security Components
│   │   │       │   ├── AdminUserDetailsService.java # User details service
│   │   │       │   ├── JwtAuthenticationFilter.java # JWT filter
│   │   │       │   └── JwtTokenProvider.java        # JWT token provider
│   │   │       └── service/                          # Business Logic Services
│   │   │           ├── AdminAuthService.java        # Authentication service
│   │   │           ├── CategoryService.java
│   │   │           ├── ComplaintService.java
│   │   │           ├── DashboardService.java
│   │   │           ├── OrderService.java
│   │   │           ├── RestaurantService.java
│   │   │           ├── RevenueService.java
│   │   │           └── UserService.java
│   │   └── resources/
│   │       ├── application.properties         # Main configuration file
│   │       ├── application-dev.properties     # Development config
│   │       ├── application-prod.properties    # Production config
│   │       └── application-test.properties    # Test config
│   └── test/
│       └── java/com/foodiebuddy/admin/        # Unit tests
│           ├── controller/
│           ├── service/
│           └── repository/
├── target/                    # Build output (generated)
│   ├── classes/              # Compiled classes
│   ├── generated-sources/    # Generated source code
│   └── *.jar                # Built JAR file
├── pom.xml                   # Maven build configuration
├── mvnw                      # Maven wrapper (Unix/Linux/Mac)
├── mvnw.cmd                  # Maven wrapper (Windows)
├── .env.example              # Example environment variables
├── README.md                 # Backend-specific documentation
└── .gitignore               # Backend-specific git ignores
```

### Backend Key Files Explained

| File | Purpose |
|------|---------|
| `AdminBackendApplication.java` | Main entry point for Spring Boot application |
| `pom.xml` | Maven configuration - dependencies, plugins, build settings |
| `application.properties` | Database, server, JWT, and other configurations |
| `SecurityConfig.java` | Spring Security configuration - authentication and authorization |
| `JwtTokenProvider.java` | JWT token generation and validation |
| `GlobalExceptionHandler.java` | Centralized exception handling for all endpoints |
| `DataInitializer.java` | Creates sample data on application startup |

---

## Frontend (Customer App) Structure

```
frontend/
├── src/
│   ├── components/                              # Reusable UI components
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx                  # Shopping cart sidebar
│   │   ├── common/
│   │   │   ├── ErrorState.tsx                  # Error display component
│   │   │   ├── Footer.tsx                      # App footer
│   │   │   ├── LoadingSkeleton.tsx             # Loading state component
│   │   │   └── Navbar.tsx                      # Navigation bar
│   │   ├── home/
│   │   │   ├── CategoryList.tsx                # Food categories list
│   │   │   ├── HeroSection.tsx                 # Homepage hero banner
│   │   │   └── PromotionBanners.tsx            # Promotional banners
│   │   └── restaurant/
│   │       ├── FoodItemCard.tsx                # Individual food item card
│   │       └── RestaurantCard.tsx              # Restaurant card
│   ├── features/                                # Redux state slices
│   │   ├── auth/
│   │   │   └── authSlice.ts                    # Authentication state
│   │   ├── cart/
│   │   │   └── cartSlice.ts                    # Shopping cart state
│   │   └── restaurant/
│   │       └── restaurantSlice.ts              # Restaurant/menu state
│   ├── layouts/
│   │   ├── AdminLayout.tsx                     # Admin layout (if applicable)
│   │   └── CustomerLayout.tsx                  # Customer app layout wrapper
│   ├── pages/
│   │   └── customer/
│   │       ├── CheckoutPage.tsx                # Checkout page
│   │       ├── HomePage.tsx                    # Homepage
│   │       ├── OrderTrackingPage.tsx           # Order tracking page
│   │       └── RestaurantDetailPage.tsx        # Restaurant detail page
│   ├── services/
│   │   ├── apiClient.ts                        # Axios HTTP client instance
│   │   ├── authService.ts                      # Authentication API calls
│   │   ├── cartService.ts                      # Cart API calls
│   │   └── restaurantService.ts                # Restaurant API calls
│   ├── store/                                   # Redux store configuration
│   │   ├── hooks.ts                            # Redux hooks (useAppDispatch, useAppSelector)
│   │   └── store.ts                            # Store configuration
│   ├── App.tsx                                  # Root component with routing
│   ├── index.css                               # Global styles
│   ├── App.css                                 # App component styles
│   ├── main.tsx                                # Entry point
│   └── vite-env.d.ts                           # TypeScript definitions for Vite
├── public/                                      # Static assets
│   └── (images, etc.)
├── node_modules/                               # Dependencies (generated)
├── dist/                                       # Production build output (generated)
├── package.json                                # NPM dependencies and scripts
├── package-lock.json                           # Locked dependency versions
├── .env                                        # Environment variables (local)
├── .env.example                                # Environment variables template
├── vite.config.ts                              # Vite build configuration
├── tsconfig.json                               # TypeScript root config
├── tsconfig.app.json                           # TypeScript app config
├── tsconfig.node.json                          # TypeScript node config
├── eslint.config.js                            # ESLint configuration
├── index.html                                  # HTML template
├── .gitignore                                  # Git ignore for frontend
├── README.md                                   # Frontend-specific documentation
└── (other config files)
```

### Frontend Key Files Explained

| File | Purpose |
|------|---------|
| `main.tsx` | Mounts React app to DOM |
| `App.tsx` | Root component with routing |
| `vite.config.ts` | Build tool config, includes API proxy settings |
| `apiClient.ts` | Axios instance with request/response interceptors |
| `authSlice.ts` | Redux state management for authentication |
| `cartSlice.ts` | Redux state management for shopping cart |

---

## Admin Frontend Structure

```
admin-frontend/
├── src/
│   ├── components/
│   │   ├── AdminLayout.tsx                     # Main admin layout wrapper
│   │   ├── Sidebar.tsx                         # Navigation sidebar
│   │   └── Topbar.tsx                          # Top navigation bar
│   ├── pages/
│   │   ├── LoginPage.tsx                       # Admin login page
│   │   ├── DashboardPage.tsx                   # Dashboard/statistics
│   │   ├── RestaurantsPage.tsx                 # Restaurants management
│   │   ├── UsersPage.tsx                       # Users management
│   │   ├── OrdersPage.tsx                      # Orders management
│   │   ├── RevenuePage.tsx                     # Revenue analytics
│   │   ├── ComplaintsPage.tsx                  # Complaints management
│   │   └── CategoriesPage.tsx                  # Categories management
│   ├── services/
│   │   └── api.ts                              # Axios instance with API endpoints
│   ├── stores/
│   │   └── index.ts                            # Zustand stores (auth, theme)
│   ├── App.tsx                                 # Root component with routing
│   ├── index.css                               # Global styles
│   ├── main.tsx                                # Entry point
│   └── vite-env.d.ts                           # TypeScript Vite definitions
├── public/                                      # Static assets
├── node_modules/                               # Dependencies (generated)
├── dist/                                       # Production build output (generated)
├── package.json                                # NPM dependencies and scripts
├── package-lock.json                           # Locked dependency versions
├── .env                                        # Environment variables (local)
├── .env.example                                # Environment variables template
├── vite.config.ts                              # Vite build configuration
├── tsconfig.json                               # TypeScript root config
├── tsconfig.app.json                           # TypeScript app config
├── tsconfig.node.json                          # TypeScript node config
├── eslint.config.js                            # ESLint configuration
├── index.html                                  # HTML template
├── .gitignore                                  # Git ignore for admin frontend
├── README.md                                   # Admin frontend documentation
└── (other config files)
```

### Admin Frontend Key Files Explained

| File | Purpose |
|------|---------|
| `main.tsx` | Application entry point |
| `App.tsx` | Root component with route definitions |
| `api.ts` | Axios instance with admin API endpoints |
| `stores/index.ts` | Zustand stores for auth and theme state |
| `vite.config.ts` | Build configuration with API proxy |

---

## Configuration Files

### Environment Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| `.env` | Each project root | Actual environment variables (Git-ignored) |
| `.env.example` | Each project root | Template for environment variables |
| `.gitignore` | Root & each project | Files to exclude from Git |

### Build Configuration Files

| File | Project | Purpose |
|------|---------|---------|
| `pom.xml` | Backend | Maven dependencies and build configuration |
| `package.json` | Frontend/Admin | NPM scripts and dependencies |
| `vite.config.ts` | Frontend/Admin | Vite build tool configuration |
| `tsconfig.json` | Frontend/Admin | TypeScript compiler configuration |

### Code Quality Configuration Files

| File | Project | Purpose |
|------|---------|---------|
| `.eslintrc.js` or `eslint.config.js` | Frontend/Admin | ESLint rules |
| `.formatting` rules | All | Code formatting standards |

---

## File Naming Conventions

### Backend (Java)
- **Classes:** `PascalCase.java` (e.g., `UserController.java`)
- **Packages:** lowercase (e.g., `com.foodiebuddy.admin.controller`)
- **Interfaces:** `PascalCase.java` with capital letter (e.g., `UserRepository.java`)

### Frontend & Admin (TypeScript/React)
- **Components:** `PascalCase.tsx` (e.g., `CategoryList.tsx`)
- **Utilities:** `camelCase.ts` (e.g., `apiClient.ts`)
- **Services:** `camelCase.ts` (e.g., `authService.ts`)
- **Hooks:** `use` prefix in camelCase (e.g., `useAppDispatch`)
- **Folders:** lowercase with hyphens for multi-word (e.g., `cart-drawer`)

---

## Generated Directories

These directories are generated during build/development and should be in `.gitignore`:

| Directory | Purpose | When Created |
|-----------|---------|--------------|
| `backend/target/` | Build output, compiled classes | After `mvn clean install` |
| `frontend/node_modules/` | JavaScript dependencies | After `npm install` |
| `frontend/dist/` | Production build output | After `npm run build` |
| `admin-frontend/node_modules/` | JavaScript dependencies | After `npm install` |
| `admin-frontend/dist/` | Production build output | After `npm run build` |

---

## Important Files to Know

### Backend
- **`application.properties`** - Configuration (database, JWT, port)
- **`SecurityConfig.java`** - Authentication and authorization rules
- **`GlobalExceptionHandler.java`** - Global error handling
- **`DataInitializer.java`** - Initial data setup

### Frontend
- **`apiClient.ts`** - HTTP client with authentication interceptors
- **`vite.config.ts`** - API proxy configuration for development
- **`store.ts`** and slices - Redux state management

### Admin Frontend
- **`api.ts`** - Admin API endpoints
- **`stores/index.ts`** - Zustand state (auth & theme)
- **`vite.config.ts`** - API proxy configuration

---

## Development Workflow

```
frontend/node_modules     <- npm install (install deps once)
frontend/src/             <- edit source files
npm run dev               <- dev server watches changes
browser (localhost:5173)  <- auto-reload on save

admin-frontend/ (same pattern, port 5174)

backend/src/              <- edit source files
./mvnw spring-boot:run    <- watches changes (with hot reload)
http://localhost:8080     <- test endpoints
```

---

## Dependencies Organization

### Backend (Maven)
- Build dependencies in `pom.xml`
- Automatic download to `~/.m2/repository` (local machine cache)
- Project dependencies in `target/` folder

### Frontend (NPM)
- Dependencies listed in `package.json`
- Installed to `node_modules/` folder
- Lock file: `package-lock.json` (exact versions)
- Don't commit `node_modules/`, only commit lock file

---

## Related Documentation

- [Main README](README.md) - Project overview
- [Setup Guide](SETUP.md) - Complete setup instructions
- [Backend README](backend/README.md) - Backend details
- [Frontend README](frontend/README.md) - Frontend details
- [Admin README](admin-frontend/README.md) - Admin details

---

## Quick Navigation

**I need to...**
- Understand the API structure → See `backend/README.md`
- Set up my development environment → See `SETUP.md`
- Work on customer UI → See `frontend/src/`
- Work on admin panel → See `admin-frontend/src/`
- Add new API endpoint → See `backend/src/main/java/.../controller/`
- Configure authentication → See `backend/src/main/resources/application.properties`
- Understand project organization → You're already here! ✓
