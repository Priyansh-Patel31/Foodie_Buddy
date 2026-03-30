# Foodie-Buddy Setup Guide

Complete step-by-step guide to set up and run the Foodie-Buddy food ordering platform locally.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Java 17+** installed - [Download Java](https://www.oracle.com/java/technologies/downloads/)
  ```bash
  java -version  # Should show Java 17+
  ```

- [ ] **Node.js 16+** and **npm** installed - [Download Node.js](https://nodejs.org/)
  ```bash
  node -v   # Should show v16+
  npm -v    # Should show 7.0+
  ```

- [ ] **MongoDB 4.4+** installed and running - [Download MongoDB](https://www.mongodb.com/try/download/community)
  ```bash
  # On Windows (if using MongoDB as service)
  # Should be running if installed as service
  
  # Or start manually:
  mongod
  ```

- [ ] **Git** installed (optional) - [Download Git](https://git-scm.com/)

## Quick Start (5 Minutes)

### Terminal 1: Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Wait until you see: `Started AdminBackendApplication`

### Terminal 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit: **http://localhost:5173**

### Terminal 3: Start Admin Dashboard

```bash
cd admin-frontend
npm install
npm run dev
```

Visit: **http://localhost:5174**

---

## Detailed Setup Instructions

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd Foodie-Buddy
```

### Step 2: MongoDB Setup

**Option A: Local MongoDB (Recommended for Development)**

1. **Install MongoDB**
   - Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [official guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB**
   - Windows: MongoDB starts as a service automatically
   - macOS/Linux:
     ```bash
     mongod
     ```

3. **Verify Connection**
   ```bash
   mongo  # or mongosh (newer versions)
   # You should see the mongo shell prompt
   # Type 'exit' to quit
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Copy connection string
4. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/food_admin
   ```

### Step 3: Backend Setup

```bash
cd backend

# Build the project (downloads dependencies)
./mvnw clean install

# Start the server
./mvnw spring-boot:run
```

Expected Output:
```
Tomcat started on port(s): 8080 (http)
Started AdminBackendApplication in X.XXX seconds
```

**Verify Backend:**
- API: Visit http://localhost:8080/swagger-ui.html
- Swagger UI should display all available endpoints

### Step 4: Frontend (Customer App) Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# (The .env already has the correct configuration)

# Start development server
npm run dev
```

Expected Output:
```
VITE v5.4.X ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

**Verify Frontend:**
- Visit http://localhost:5173
- You should see the customer interface

### Step 5: Admin Dashboard Setup

```bash
cd admin-frontend

# Install dependencies
npm install

# Create environment file (optional)
cp .env.example .env

# Start development server
npm run dev
```

Expected Output:
```
VITE v6.3.X ready in XXX ms

➜  Local:   http://localhost:5174/
➜  press h to show help
```

**Verify Admin Dashboard:**
- Visit http://localhost:5174
- You should see the admin login page
- Default credentials: (check backend DataInitializer for default admin)

---

## Environment Configuration

### Backend Configuration

Located in: `backend/src/main/resources/application.properties`

Default configuration:
```properties
spring.application.name=admin-backend
server.port=8080

# MongoDB (requires MongoDB to be running)
spring.data.mongodb.uri=mongodb://localhost:27017/food_admin

# JWT
jwt.secret=9B948332E90124FD6F8BA06733224B27AE2DFFDAAD6A0D523C641DC5E21B90FE5ECC4ECBC7D01FA9706C8B4C02506EA9C394A790F3BFF61266B3EB6AAAEBA1BE
jwt.expiration=86400000
```

**For Production:**
- Generate new JWT secret: `openssl rand -base64 64`
- Use environment variables or external configuration files
- Enable HTTPS

### Frontend Configuration

Located in: `frontend/.env`

```
VITE_API_URL=/api
```

Proxy Configuration in: `frontend/vite.config.ts`
- Development: `/api` → `http://localhost:8080`
- Production: Update to your API URL

### Admin Frontend Configuration

Located in: `admin-frontend/.env`

No required environment variables (uses hardcoded `/api/admin` path)

---

## Running the Full Application

### Using Three Terminal Windows

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 - Customer Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Admin Frontend:**
```bash
cd admin-frontend
npm run dev
```

### Access Points

- **Customer App:** http://localhost:5173
- **Admin Dashboard:** http://localhost:5174
- **API Server:** http://localhost:8080
- **API Documentation:** http://localhost:8080/swagger-ui.html

---

## First Time Usage

### 1. Check Backend Status

```bash
# Terminal 4: Check if backend is running
curl http://localhost:8080/swagger-ui.html
# Should return HTML content
```

### 2. Seed Initial Data

The backend automatically initializes with sample data on first run:
- Admin user (credentials in DataInitializer)
- Sample categories
- Sample restaurants
- Sample users

Check logs for initialization details.

### 3. Admin Login

1. Go to http://localhost:5174
2. Login with admin credentials:
   - Username: `admin` (or check DataInitializer.java)
   - Password: Check backend initialization logs
3. You should see the admin dashboard

### 4. Customer App

1. Go to http://localhost:5173
2. You should see restaurants and food categories
3. Try browsing and adding items to cart

---

## Troubleshooting

### Backend won't start

**Error: Cannot connect to MongoDB**
```
Solution:
1. Verify MongoDB is running: mongosh --eval "db"
2. Check connection string in application.properties
3. If using Atlas, verify IP whitelist
```

**Error: Port 8080 already in use**
```
Solution - Option 1:
Change port in application.properties:
server.port=8081

Solution - Option 2:
Kill process on port 8080:
# Windows: netstat -ano | findstr :8080
# macOS/Linux: lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Frontend won't start

**Error: Dependencies not found**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Error: Port 5173 already in use**
```bash
# Kill process on port 5173
# Windows: netstat -ano | findstr :5173
# macOS/Linux: lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Cannot connect to backend from frontend

**Error: API requests failing (404 or CORS)**
```
Solution:
1. Ensure backend is running: http://localhost:8080/swagger-ui.html
2. Check browser console for actual error
3. Verify proxy in frontend/vite.config.ts
4. Clear browser cache and reload
```

### MongoDB connection refused

**Error: Error connecting to mongodb://localhost:27017**
```bash
Solution:
1. Check MongoDB is installed: mongod --version
2. Start MongoDB:
   - Windows: Should be running as service
   - macOS: brew services start mongodb-community
   - Linux: sudo systemctl start mongod

3. Verify local connection:
   - mongosh (or mongo)
   - show dbs
```

### CORS errors in browser

```
Error: Access to XMLHttpRequest has been blocked by CORS policy

Solution:
1. Backend CORS is already configured in SecurityConfig.java
2. Verify frontend URL is allowed in CorsConfig
3. Ensure backend is running
```

### Admin frontend won't authenticate

```
Solution:
1. Verify backend is running
2. Check admin credentials in DataInitializer.java
3. Look at Network tab in browser DevTools
4. Check backend logs for error messages
```

---

## Common Commands

### Backend

```bash
# Build without running
cd backend && ./mvnw clean install

# Build and run tests
cd backend && ./mvnw clean test

# View dependency tree
cd backend && ./mvnw dependency:tree

# Build for production
cd backend && ./mvnw clean package
# JAR will be at: target/admin-backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
# Check for linting issues
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### MongoDB

```bash
# Connect to database
mongosh

# List databases
show dbs

# Use specific database
use food_admin

# List collections
show collections

# Query documents
db.restaurants.find()
```

---

## Next Steps

1. **Explore API Documentation**
   - Visit http://localhost:8080/swagger-ui.html
   - Try making API calls from Swagger UI

2. **Review Source Code**
   - Check controller files for understanding endpoints
   - Review service implementations for business logic

3. **Make Changes**
   - Create your own features
   - Modify UI components
   - Add new API endpoints

4. **Run Tests**
   ```bash
   cd backend && ./mvnw test
   ```

5. **Deploy**
   - Follow deployment guides in individual README files
   - Configure for production settings
   - Set up CI/CD pipeline

---

## Production Deployment

See individual project README files:
- [Backend Deployment](./backend/README.md#building-for-production)
- [Frontend Deployment](./frontend/README.md#building--deployment)
- [Admin Frontend Deployment](./admin-frontend/README.md#building--deployment)

---

## Getting Help

1. Check relevant README files in each folder
2. Review error messages in console/logs
3. Check browser DevTools Network tab for API errors
4. Create GitHub issue with:
   - Error message
   - Steps to reproduce
   - Operating system and versions
   - Screenshots if applicable

---

## Quick Reference

| Component | Port | URL | Tech |
|-----------|------|-----|------|
| Backend API | 8080 | http://localhost:8080 | Spring Boot |
| Customer Frontend | 5173 | http://localhost:5173 | React/Vite |
| Admin Frontend | 5174 | http://localhost:5174 | React/Vite |
| MongoDB | 27017 | mongodb://localhost:27017 | MongoDB |
| Swagger UI | 8080 | http://localhost:8080/swagger-ui.html | OpenAPI |

---

## Summary

You now have a complete Foodie-Buddy setup:
- ✅ Backend API running on port 8080
- ✅ Customer app running on port 5173
- ✅ Admin dashboard running on port 5174
- ✅ MongoDB database for persistence
- ✅ JWT authentication configured
- ✅ API documentation available

Start developing and building awesome features! 🚀
