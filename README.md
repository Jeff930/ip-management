# IP Management System - Docker Setup

This project is an **IP Management System** running inside Docker, featuring:
- **Angular** frontend
- **Laravel** authentication service
- **Node.js** IP management service
- **Docker Compose** for container orchestration

## Prerequisites
Ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure
```
├── frontend/       # Angular app
├── auth-service/   # Laravel authentication service
├── ip-service/     # Node.js IP management service
├── docker-compose.yml
└── README.md
```
## Environment Variables
Create `.env` files for each service:

### **Frontend**
- Environment variables are stored in src/enviroment/environment.ts

### **Auth Service (.env)**
- Copy the .env.example file at the auth-service root directory
- Rename it to .env

### **IP Service (.env)**
- Copy the .env.example file at the ip-service root directory
- Rename it to .env

## Setup & Run with Docker
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/ip-management.git
   cd ip-management
   ```

2. Build and start all services:
   ```sh
   docker-compose up --build -d
   ```
   This will create and start the following containers:
   - `frontend`: Angular frontend running on **http://localhost/**
   - `auth-service`: Laravel authentication running on **http://localhost/auth-api/**
   - `ip-service`: Node.js IP management running on **http://localhost/ip-api/**

   Handling Missing Dependencies
   - If dependencies are missing, access the respective containers and install them manually:

      FRONTEND(ANGULAR)
      ```sh
      docker exec -it ip-frontend sh
      npm install
      ```

      AUTH-SERVICE(LARAVEL)
      ```sh
      docker exec -it auth-service sh
      composer install
      php artisan migrate --seed
      ```

      IP-SERVICE(NODEJS)
      ```sh
      docker exec -it ip-management-service sh
      npm install
      ```


3. Check running containers:
   ```sh
   docker ps
   ```

4. Stop containers when done:
   ```sh
   docker-compose down
   ```

## Angular Frontend Pages

### Public Pages
- `login` - User login (Protected by `LoginGuard`)

### Authenticated Pages (Protected by `AuthGuard`)
- `profile` - User profile management
- `list-ip` - IP address management
- `list-user` - User management (Requires `view-users` permission)
- `audit-log` - View audit logs (Requires `view-logs` permission)

### Error Page
- `**` - Not Found Page


## API Endpoints

### Authentication Service (Laravel)
- `POST /api/login` - Login user
- `POST /api/refresh` - Refresh JWT token
- `POST /api/logout` - Logout user

#### User Management
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `PUT /api/users/reset-password/{id}` - Reset user password

#### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile/change-password` - Change password
- `PUT /api/profile/update` - Update profile

#### Role Management
- `GET /api/roles` - List roles

### IP Management Service (Node.js)
- `GET /api/ip-addresses` - List IP addresses
- `POST /api/ip-addresses` - Add IP address
- `PUT /api/ip-addresses/{id}` - Update IP address
- `DELETE /api/ip-addresses/{id}` - Remove IP address

### Audit Log Service
- `GET /api/logs` - View logs (Requires `view-logs` permission)
- `POST /api/log-login` - Log user login
- `POST /api/log-logout` - Log user logout

