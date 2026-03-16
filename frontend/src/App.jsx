import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ToastProvider } from "./components/toast/ToastContext";
import ToastViewport from "./components/toast/ToastViewport";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

// user Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import BusList from "./pages/BusList";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingCancellation from "./pages/BookingCancellation";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import UpdateProfile from "./pages/UpdateProfile";
import Chatbot from "./pages/Chatbot";

//admin pages
import AdminRegister from "./pages/admin/Register";
import AdminDashboard from "./pages/admin/Dashboard";

import ManageTrips from "./pages/admin/ManageTrips";
import ManageBuses from "./pages/admin/ManageBuses";
import ManageRoutes from "./pages/admin/ManageRoutes";
import ViewBookings from "./pages/admin/ViewBookings";
import ContactRequests from "./pages/admin/ContactRequests";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import ManageEmployee from "./pages/admin/ManageEmployee";

// Public Pages
import ContactUs from "./pages/ContactUs";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");

  if (!user && !admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const admin = localStorage.getItem("admin");
  const role = localStorage.getItem("role");

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// App Routes Component (needs to be inside Redux Provider)
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/buses" element={<BusList />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
        </Route>

        {/* Auth Layout Routes (no navbar/footer) */}
        <Route element={<AuthLayout />}>
          {/* user */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* admin */}
          <Route path="/admin-register" element={<AdminRegister />} />
        </Route>

        {/* Admin Layout Routes */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin/manage-trips" element={<ManageTrips />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage-buses" element={<ManageBuses />} />
          <Route path="/admin/manage-routes" element={<ManageRoutes />} />
          <Route path="/admin/bookings" element={<ViewBookings />} />
          <Route path="/admin/manage-employees" element={<ManageEmployee />} />
          <Route path="/admin/contact-requests" element={<ContactRequests />} />
          <Route path="/admin/reports" element={<ReportsAnalytics />} />
        </Route>

        {/* Standalone pages without navbar/footer */}
        <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/booking-cancellation" element={<BookingCancellation />} />
        <Route path="/seat-selection" element={<SeatSelection />} />
        <Route path="/payment" element={<Payment />} />
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AppRoutes />
      <ToastViewport />
    </ToastProvider>
  );
};

export default App;
