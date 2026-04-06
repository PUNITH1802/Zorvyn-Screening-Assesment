# Finance Data Processing and Access Control System

A production-ready backend API built with **Node.js + Express.js + MongoDB** that supports user management with role-based access control, financial records CRUD, and dashboard analytics.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Validation | express-validator |
| Security | bcryptjs, express-rate-limit |
| Logging | morgan |
| Dev | nodemon, dotenv |

---

## Project Structure

```
finance-backend/
├── app.js                          # Express app setup, middleware, routes
├── server.js                       # Entry point — DB connect + listen
├── package.json
├── .env.example                    # Environment variable template
├── .gitignore
└── src/
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── models/
    │   ├── User.js                 # User schema (name, email, role, status)
    │   └── FinanceRecord.js        # Finance record schema (amount, type, category…)
    ├── controllers/
    │   ├── userController.js       # Register, login, profile, admin actions
    │   ├── financeController.js    # CRUD for financial records
    │   └── dashboardController.js  # Summary, category, trends
    ├── routes/
    │   ├── userRoutes.js
    │   ├── financeRoutes.js
    │   └── dashboardRoutes.js
    ├── services/
    │   ├── userService.js          # Business logic for users
    │   ├── financeService.js       # Business logic for records
    │   └── dashboardService.js     # Aggregation logic
    └── middleware/
        ├── auth.js                 # JWT protect + role authorize
        ├── validate.js             # express-validator error formatter
        └── errorHandler.js        # Global 404 + error handler
```

---

## Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **viewer** | View dashboard summary only |
| **analyst** | View records + full dashboard (category, trends) |
| **admin** | Full access: create/update/delete records + manage users |

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/PUNITH1802/Zorvyn-Screening-Assesment.git
cd Zorvyn-Screening-Assesment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/finance_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

> **MongoDB Atlas:** Replace `MONGODB_URI` with your Atlas connection string.

### 4. Run the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

API base URL: `http://localhost:5000/api`

---

## API Endpoints

### Auth & Users — `/api/users`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/users/register` | Public | Register a new user |
| POST | `/api/users/login` | Public | Login and receive JWT |
| GET | `/api/users/profile` | Any authenticated | Get own profile |
| GET | `/api/users` | Admin | List all users (paginated) |
| PATCH | `/api/users/:id/role` | Admin | Assign role to user |
| PATCH | `/api/users/:id/status` | Admin | Activate/deactivate user |

### Financial Records — `/api/finance`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/finance` | Viewer+ | List records (filter by type, category, date, search) |
| GET | `/api/finance/:id` | Viewer+ | Get single record |
| POST | `/api/finance` | Admin | Create record |
| PUT | `/api/finance/:id` | Admin | Update record |
| DELETE | `/api/finance/:id` | Admin | Soft-delete record |

**Query parameters for GET /api/finance:**
- `type` — `income` or `expense`
- `category` — partial match
- `startDate` / `endDate` — ISO 8601 date range
- `search` — search in notes
- `page` / `limit` — pagination

### Dashboard — `/api/dashboard`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | Viewer+ | Total income, expense, net balance |
| GET | `/api/dashboard/category` | Analyst+ | Category-wise totals |
| GET | `/api/dashboard/trends` | Analyst+ | Monthly summaries (pass `?year=2024`) |

---

## Example curl Requests

**Register:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123","role":"admin"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

**Create a finance record (Admin only):**
```bash
curl -X POST http://localhost:5000/api/finance \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"amount":5000,"type":"income","category":"Salary","date":"2024-06-01","notes":"June salary"}'
```

**Get dashboard summary:**
```bash
curl http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer <TOKEN>"
```

**Filter records:**
```bash
curl "http://localhost:5000/api/finance?type=expense&category=food&page=1&limit=10" \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

| Code | Meaning |
|------|---------|
| 400 | Validation error / Bad request |
| 401 | Missing or invalid JWT |
| 403 | Insufficient role permissions |
| 404 | Resource not found |
| 409 | Duplicate (e.g. email already exists) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
