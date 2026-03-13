# 1. Project Title

QuickBus (DD Booking Web) – Full-stack bus ticket booking platform with an admin dashboard and analytics.

# 2. Project Description

QuickBus streamlines bus travel booking and operations management in a single platform.

- **Problem solved**: users need a fast way to discover buses, reserve seats, and manage bookings; operators need tools to manage routes, fleets, schedules, and reporting.
- **What users can do**: search routes, select seats, book tickets, download e-tickets, cancel bookings (within policy), and manage profile/history.
- **Main goal**: provide a reliable booking flow for passengers and a complete admin system for day-to-day operational control.

# 3. Project Architecture

The system is split into a React frontend and an Express backend API with MongoDB persistence:

- **Frontend layer** (`frontend/`): React + Vite UI, calls backend APIs via `axios` (cookie-based auth with `withCredentials`).
- **Backend layer** (`backend/`): Express REST API with JWT auth, role-based authorization, and business logic.
- **Database**: MongoDB (via Mongoose ODM).
- **External services / APIs** (optional):
  - Chatbot endpoints configured in the frontend via `VITE_CHATBOT_*`
  - CORS allowlist entries in the backend via `CHATBOT_URL` / `AGENT_URL`

Architecture overview:

```text
Frontend (React + Vite)
  │  axios (withCredentials)
  ▼
Backend (Node.js + Express REST API)
  │  Mongoose ODM
  ▼
Database (MongoDB)
```

Main project structure:

```text
project-root/
├─ frontend/
├─ backend/
└─ README.md
```

## Database Schema (MongoDB)

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

## Backend API Endpoints (REST)

Base path: `/api`

```http
# Auth
POST   /api/login
POST   /api/mcp-token
PUT    /api/forgetPassword
POST   /api/logout
GET    /api/me

# User
POST   /api/user/register
GET    /api/user/:userId
PUT    /api/user
POST   /api/user/search
POST   /api/user/contact-us

# Admin
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

# Trips (admin)
POST   /api/trip/filterbus
POST   /api/trip/filteremp
POST   /api/trip
GET    /api/trip/get
PUT    /api/trip/update
DELETE /api/trip/delete/:id

# Tickets
POST   /api/ticket/seat/get
POST   /api/ticket
GET    /api/ticket/admin/get
GET    /api/ticket/user/get
GET    /api/ticket/user/:id
PUT    /api/ticket/:id
PUT    /api/ticket/update/payment/:id
DELETE /api/ticket/delete/:id

# Employees (admin)
POST   /api/emp/create
POST   /api/emp/get
GET    /api/emp/getemps
PUT    /api/emp/update
DELETE /api/emp/delete/:id

# AI helper
POST   /api/ai/getbus
```

# 4. Features

- Passenger experience: bus search, seat selection, booking, e-ticket download, cancellations, profile updates, booking history
- Admin dashboard: manage routes/buses/trips/employees, view bookings, handle Contact Us requests, analytics/reporting
- Authentication: JWT-based session cookie, role-based protected routes
- Ticketing lifecycle: seat availability checks, pending→completed payment update, cancellation policy enforcement
- Integrations: optional chatbot endpoints and AI helper API route

# 5. Tech Stack

## Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Chart.js + react-chartjs-2
- jsPDF

## Backend

- Node.js (ESM)
- Express.js
- Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- `bcrypt`, `cookie-parser`, `cors`, `dotenv`
- `nodemon` (development)

## Database

- MongoDB

## External APIs / Services

- Optional chatbot endpoints (configured via frontend env vars)

# 6. Setup Instructions

1. Clone the repository

```bash
git clone <your-repo-url>
cd <repo-folder>
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Configure environment variables

- Create `backend/.env` and `frontend/.env` (examples below).

5. Run the backend server

```bash
cd ../backend
npm run server
```

6. Run the frontend application

```bash
cd ../frontend
npm run dev
```

# 7. Environment Variables

## Backend (`backend/.env`)

```env
PORT=2026

# Mongo connection string base (the app connects to ${DB_URL}/quickbus)
DB_URL=mongodb+srv://<username>:<password>@<cluster-host>

# JWT signing secret and expiry
ACCESS_TOKEN=<your-jwt-secret>
ACCESS_TOKEN_EXPIRE=1d

# Allowed origins for CORS
FRONTEND_URL=http://localhost:5173

# Optional: include chatbot/agent origins if used
CHATBOT_URL=
AGENT_URL=
```

## Frontend (`frontend/.env`)

```env
VITE_BASE_URI=http://localhost:2026
VITE_LOADER_DELAY=0

# Optional chatbot configuration
VITE_CHATBOT_NORMAL=https://<chatbot-domain>/chat
VITE_CHATBOT_AUTH=https://<agent-domain>/chat
```

