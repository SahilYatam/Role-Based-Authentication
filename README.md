# 🔐 Role-Based Authentication System

A full-stack application implementing secure authentication, role-based access control (RBAC), and permission-driven workflows with admin moderation.

---

## 🌐 Overview

This system provides a structured authentication and authorization flow where users can register, verify their identity via OTP, and request elevated roles (Editor/Admin).

Access to protected resources is enforced using **role-based and permission-based middleware**, ensuring secure and controlled operations across the application.

---

## 🌐 Live Demo
👉 [RBAC](https://role-based-authentication-psi.vercel.app)

## ⚙️ Key Features

* 🔐 JWT-based authentication with secure session handling
* 📧 OTP-based email verification during registration
* 🛡️ Role-Based Access Control (Member, Editor, Admin)
* 📥 Role request & approval workflow (Admin-controlled)
* 🔄 Refresh token-based session management
* ✅ Request validation using centralized schema validation
* ⚡ Rate limiting for authentication and API protection

---

## ⚙️ Setup Instructions

```bash
# Clone repository
git clone https://github.com/SahilYatam/Role-Based-Authentication

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup
cd frontend
npm install
npm run dev
```

---

## 🏗️ Architecture

### Backend (Monolithic Structure)

```bash
backend/src/
 ├── config/
 ├── controllers/
 ├── message-broker/
 ├── middleware/
 ├── models/
 ├── repositories/
 ├── routers/
 ├── services/
 ├── startup/
 ├── utils/
 ├── validators/
 ├── app.js
 └── server.js
```

---

### 🧩 Architecture Pattern

* **Controller Layer** → Handles HTTP requests/responses
* **Service Layer** → Business logic and workflows
* **Repository Layer** → Database interactions
* **Middleware Layer** → Authentication, authorization, validation

This separation ensures scalability, maintainability, and clean code structure.

---

### Frontend Structure

```bash
frontend/src/
 ├── api/
 ├── components/
 ├── features/
 │    ├── auth/
 │    ├── role/
 │    ├── task/
 │    ├── roleRequest/
 ├── layouts/
 ├── pages/
 ├── store/
 ├── ProtectedRoute.jsx
```

---

### 🧠 State Management

* Redux Toolkit (RTK)
* Organized by feature:

  * `slice` → state logic
  * `thunks` → async API calls

---

## 🔌 API Documentation

### 🔗 Base URL

```bash
http://localhost:8000/api/v1
```

---

## 🔐 Auth Routes

```bash
POST   /auth/register
POST   /auth/verifyOtp
POST   /auth/validate-credentials
POST   /auth/login
POST   /auth/logout
POST   /auth/forgetPassword-request
POST   /auth/reset-password/:token
```

---

## 🔄 Session Routes

```bash
POST   /session/refresh-accessToken
```

---

## 👤 User Routes

```bash
GET    /user/me
GET    /user/users   (Admin only)
```

---

## 🛡️ Role Routes

```bash
POST   /role/assign-role/:id
GET    /role/roles-key/:key
GET    /role/default-roles
```

---

## 📥 Role Request Routes

```bash
POST   /roleRequest/apply-roleRequest
GET    /roleRequest/get-role-request
POST   /roleRequest/approve-role/:requestId
POST   /roleRequest/reject-role/:requestId
```

---

## ✅ Task Routes

```bash
POST   /task/create-task
PATCH  /task/update-task/:id
PATCH  /task/mark-complete-task/:id
GET    /task/all-task
GET    /task/get-complete-task
DELETE /task/delete-task/:id
```

---

## 🔐 Security & Middleware

* **Authentication Middleware** → Verifies JWT tokens
* **Authorization Middleware** → Restricts access based on roles
* **Permission Middleware** → Fine-grained control (e.g., adminPanelAccess)
* **Validation Middleware** → Request validation using schemas
* **Rate Limiting** → Prevents abuse on sensitive routes

---

## 🔄 Role Workflow

1. User registers → gets default role (Member)
2. User applies for elevated role
3. Admin reviews request
4. Admin approves/rejects request
5. Role is updated with enforced permissions

---

## 🛠️ Tech Stack

### Backend

* Node.js + Express
* MongoDB
* JWT Authentication
* RabbitMQ (email queue)

### Frontend

* React (Vite)
* Redux Toolkit
* TailwindCSS

---

## 📌 Future Improvements

* Add granular permission system (beyond role-based)
* Introduce audit logs for admin actions
* Improve scalability with service-based architecture

---

