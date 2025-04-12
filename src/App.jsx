// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Hooks/context/AuthContext"; // Import AuthProvider

// Layouts
import AppLayout from "./components/layouts/AppLayout"; // Main layout for the app
import ProtectedRoute from "./components/layouts/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import GuestFeedbackPage from "./pages/GuestFeedbackPage";
import StaffLogPage from "./pages/StaffLogPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage"; // Create a simple 404 page

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page Route - Uses its OWN Navbar/Footer */}
          <Route path="/" element={<HomePage />} />

          {/* Login Route - Also outside AppLayout */}
          <Route path="/login" element={<LoginPage />} />

          {/* Routes within the Main Layout */}
          <Route element={<AppLayout />}>
            {/* Accessible to all logged-in users / or public */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/feedback" // Guest feedback page
              element={
                <ProtectedRoute allowedRoles={["guest", "staff", "admin"]}>
                  {" "}
                  {/* Anyone logged in can give feedback */}
                  <GuestFeedbackPage />
                </ProtectedRoute>
              }
            />

            {/* Staff Routes */}
            <Route
              path="/staff/log"
              element={
                <ProtectedRoute allowedRoles={["staff", "admin"]}>
                  {" "}
                  {/* Staff and Admin access */}
                  <StaffLogPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>

                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
