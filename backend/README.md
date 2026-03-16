# QuickBus Backend (REST API)

Express + MongoDB backend API for the QuickBus / DD Booking platform—handles authentication, bus/route/trip management, ticketing, and admin analytics.

## Overview

This backend powers the platform’s core business logic and data layer. It is responsible for:

- **Authentication & sessions** using JWT (issued on login and stored as an HTTP-only cookie).
- **Role-based authorization** to protect admin and user routes.
- **Database operations** for users, buses, routes, trips, tickets, employees, and contact requests.
- **REST API handling** consumed by the React frontend.
- **Integrations** such as chatbot/agent-friendly endpoints (CORS allowlist + AI helper route).

## Tech Stack

- **Runtime**: Node.js (ESM modules)
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) via cookie and Bearer header
- **Security/Utilities**: `bcrypt`, `cookie-parser`, `cors`
- **Configuration**: `dotenv`
- **Dev tooling**: `nodemon`

## Features

- User registration and login/logout
- JWT-based session cookie (`accesstoken`) and `/api/me` authentication check
- Role-based access control for **user** vs **admin** APIs
- Bus search API based on route stops, trip schedule, and seat availability
- Ticketing workflow:
  - Seat availability lookup for a trip segment
  - Ticket creation (pending payment) and payment completion update
  - Ticket cancellation with time constraint
  - Ticket listing for user/admin views
- Admin operations:
  - Create/update/delete routes (also auto-creates a reverse route)
  - Create/update/delete buses
  - Create/update/delete trips and schedule filtering helpers
  - Manage employees (drivers/conductors)
  - Dashboard KPIs and reporting/analytics
  - View and mark Contact Us requests as read
- AI helper endpoint to fetch bus options for a given source/destination

## Database Schema

User
```text
name: string
email: string
phone: number
password: string        # bcrypt hash
role: "user" | "admin"
createdAt: Date
updatedAt: Date
```

Employee
```text
name: string
phone: number           # unique
city: string
role: "driver" | "conductor"
createdAt: Date
updatedAt: Date
```

Bus
```text
name: string
busNumber: string
totalSeats: number
type: "seating" | "sleeper"
basePricePerKm: number
amenties: ("WiFi" | "AC" | "Charging")[]
createdAt: Date
updatedAt: Date
```

Route
```text
ogroute: ObjectId(Route)    # reference to original route (for reverse routes)
stops: [
  {
    name: string,
    predistance: number,    # distance to next stop
    pretime: number         # time to next stop (hours)
  }
]
createdAt: Date
updatedAt: Date
```

Trip
```text
routeId: ObjectId(Route)
busId: ObjectId(Bus)
departureTime: string       # e.g. "10:30 AM"
arrivalTime: string
minimumRevenue: number
days: number[]              # 0=Sun ... 6=Sat
driver: ObjectId(Employee)
conductor: ObjectId(Employee)
createdAt: Date
updatedAt: Date
```

Ticket
```text
user: ObjectId(User)
trip: ObjectId(Trip)
pnr: string
from: string
to: string
seats: number[]
passengers: [
  { name: string, age: number, gender: "male" | "female" }
]
ticketdate: string
status: "booked" | "cancelled"
totalamount: number
paymentstatus: "completed" | "pending"
createdAt: Date
updatedAt: Date
```

ContactUs
```text
name: string
email: string
subject: string
message: string
isRead: boolean
createdAt: Date
updatedAt: Date
```

## API Endpoints

Base path: `/api`

Notes:

- Protected routes expect an auth token via `accesstoken` cookie or `Authorization: Bearer <token>`.
- Many routes are additionally restricted by role (`user` or `admin`).

### Authentication

```http
POST   /api/login
POST   /api/mcp-token
PUT    /api/forgetPassword
POST   /api/logout
GET    /api/me
```

### User

```http
POST   /api/user/register
GET    /api/user/:userId
PUT    /api/user
POST   /api/user/search
POST   /api/user/contact-us
```

### Admin

```http
POST   /api/admin/register
GET    /api/admin/:adminId

GET    /api/admin/dashboard/home
POST   /api/admin/dashboard/report

POST   /api/admin/route
GET    /api/admin/route/get
GET    /api/admin/route/stops
GET    /api/admin/route/:id
PUT    /api/admin/route/update
DELETE /api/admin/route/:id

POST   /api/admin/bus
GET    /api/admin/bus/get
GET    /api/admin/bus/:id
PUT    /api/admin/bus
DELETE /api/admin/bus/:id

GET    /api/admin/util/contact-us
PATCH  /api/admin/util/contact-us/:id/read
```

### Trips (Admin)

```http
POST   /api/trip/filterbus
POST   /api/trip/filteremp
POST   /api/trip
GET    /api/trip/get
PUT    /api/trip/update
DELETE /api/trip/delete/:id
```

### Tickets

```http
POST   /api/ticket/seat/get
POST   /api/ticket
GET    /api/ticket/admin/get
GET    /api/ticket/user/get
GET    /api/ticket/user/:id
PUT    /api/ticket/:id
PUT    /api/ticket/update/payment/:id
DELETE /api/ticket/delete/:id
```

### Employees (Admin)

```http
POST   /api/emp/create
POST   /api/emp/get
GET    /api/emp/getemps
PUT    /api/emp/update
DELETE /api/emp/delete/:id
```

### AI Helper

```http
POST   /api/ai/getbus
```

## Installation

1. Clone the repository

```bash
git clone <your-repo-url>
```

2. Navigate to the backend directory

```bash
cd <repo-folder>/backend
```

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm run server
```

To run in production mode:

```bash
npm start
```

## Environment Variables

Create a `backend/.env` file with the following values:

```env
PORT=2026

# Mongo connection string (the app connects to ${DB_URL}/quickbus)
DB_URL=mongodb+srv://<username>:<password>@<cluster-host>

# JWT signing secret and expiry
ACCESS_TOKEN=<your-jwt-secret>
ACCESS_TOKEN_EXPIRE=1d

# Allowed origins for CORS
FRONTEND_URL=http://localhost:5173

# Optional: include chatbot/agent origins if needed
CHATBOT_URL=https://<your-chatbot-domain>
AGENT_URL=https://<your-agent-domain>
```

## Security Features

- Password hashing using `bcrypt`
- JWT-based authentication via **HTTP-only cookie** (`accesstoken`) and optional Bearer token header support
- Role-based authorization middleware for admin/user protected routes
- CORS allowlist based on environment-configured origins
- Basic request payload validation in controllers (required fields, formats, and constraints)
- Secrets and configuration loaded via environment variables (`dotenv`)

