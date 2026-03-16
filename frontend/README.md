# QuickBus Frontend

Modern React (Vite) frontend for the QuickBus / DD Booking web platform—built for bus search, seat selection, booking flows, and admin operations.

## Project Overview

This frontend application provides the complete user interface for a bus ticket booking platform:

- **Customer UI**: search available buses, pick a travel date, select seats, complete booking, manage profile, and view booking history.
- **Admin UI**: access a dedicated dashboard to manage routes, buses, trips, employees, bookings, and analytics.

The UI communicates with the backend over HTTP using `axios` (cookie-based requests via `withCredentials`) and relies on environment variables to configure the API base URL and optional chatbot endpoints.

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Chart.js + react-chartjs-2
- jsPDF
- Lucide React (icons)
- ESLint

## Features (Frontend Only)

- Route-based navigation with separate **Main**, **Auth**, and **Admin** layouts
- Bus search experience with **city autocomplete** and **date picker**
- Seat selection UI and passenger details capture
- Booking confirmation / cancellation screens
- Downloadable **PDF e-ticket**
- Profile management and booking history views
- Admin dashboard UI with charts and analytics visualizations
- Admin management screens for routes, buses, trips, employees, and bookings
- Reusable loading states (skeletons/spinners) and toast notifications
- Embedded chatbot widget with session persistence (configurable endpoints)

## Folder Structure

```text
frontend/
├─ public/                  # Static files served directly (favicons, etc.)
├─ src/
│  ├─ assets/               # Images and static assets
│  ├─ components/           # Reusable UI components
│  │  ├─ admin/             # Admin-specific components (modals, sidebar, cards)
│  │  ├─ chatbot/           # Chatbot widget and chat UI
│  │  ├─ skeletons/         # Skeleton loaders and spinners
│  │  └─ toast/             # Toast notification system
│  ├─ context/              # React Context providers (auth/user state)
│  ├─ data/                 # Local/static data used by the UI
│  ├─ helpers/              # Small utilities (e.g., loader delay)
│  ├─ hooks/                # Custom React hooks
│  ├─ layouts/              # Page layouts (Main/Auth/Admin)
│  ├─ pages/                # Route-level pages
│  │  └─ admin/             # Admin pages
│  ├─ App.jsx               # App routing and route guards
│  └─ main.jsx              # Application entry point
├─ index.html
├─ vite.config.js
└─ package.json
```

## Installation

1. Clone the repository

```bash
git clone <your-repo-url>
```

2. Navigate to the frontend folder

```bash
cd <repo-folder>/frontend
```

3. Install dependencies

```bash
npm install
```

4. Run the development server

```bash
npm run dev
```

Vite will start the app (by default) at `http://localhost:5173`. Ensure your backend is running and `VITE_BASE_URI` is set correctly (see below).

## Environment Variables

The frontend uses Vite environment variables (prefixed with `VITE_`) for API and UI behavior configuration:

- `VITE_BASE_URI`: Base URL of the backend API (used by `axios` requests).
- `VITE_LOADER_DELAY`: Optional loader delay (in seconds) for demo/skeleton states during development.
- `VITE_CHATBOT_NORMAL`: Chatbot endpoint for unauthenticated users.
- `VITE_CHATBOT_AUTH`: Chatbot endpoint for authenticated users.

Create or update `frontend/.env` with the following:

```env
VITE_BASE_URI=http://localhost:2026
VITE_LOADER_DELAY=2
VITE_CHATBOT_NORMAL=https://<chatbot-origin>/chat
VITE_CHATBOT_AUTH=https://<chat-bot->/chat
```
