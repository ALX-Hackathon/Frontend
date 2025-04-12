// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Hooks/context/AuthContext"; // Auth context provider

// Layout for INTERNAL app pages
import AppLayout from "./components/layouts/AppLayout"; // Corrected path
import ProtectedRoute from "./components/layouts/ProtectedRoute"; // Corrected path
import ContextualFeedbackPage from "./pages/ContextualFeedbackPage";

// --- Pages ---
// Landing Page (does NOT use AppLayout)
import HomePage from "./pages/HomePage";

// Public Pages (potentially outside AppLayout)
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage"; // General 404

// Internal App Pages (use AppLayout)
import GuestFeedbackPage from "./pages/GuestFeedbackPage";
import StaffLogPage from "./pages/StaffLogPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
// import UserDashboardPage from './pages/UserDashboardPage'; // If you create this

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page Route - Uses its OWN Navbar/Footer */}
          <Route path="/" element={<HomePage />} />
          {/* Login Route - Also outside AppLayout */}
          <Route path="/login" element={<LoginPage />} />
          {/* Routes within the Standard App Layout */}
          <Route element={<AppLayout />}>
            {" "}
            {/* Internal pages wrapped */}
            {/* NEW: Contextual Feedback Entry Point from QR Scan */}
            <Route path="/f" element={<ContextualFeedbackPage />} />
            {/* This page doesn't use AppLayout to avoid Navbar/Footer distractions initially */}
            {/* Redirect authenticated users from login-attempt? Maybe handled in LoginPage */}
            {/* <Route path="/dashboard" element={<ProtectedRoute ...><UserDashboardPage/></ProtectedRoute>} /> Example internal home */}
            {/* Feedback page (requires login) */}
            <Route
              path="/feedback"
              element={
                <ProtectedRoute allowedRoles={["guest", "staff", "admin"]}>
                  <GuestFeedbackPage />
                </ProtectedRoute>
              }
            />
            {/* Staff page (requires staff/admin role) */}
            <Route
              path="/staff/log"
              element={
                <ProtectedRoute allowedRoles={["staff", "admin"]}>
                  <StaffLogPage />
                </ProtectedRoute>
              }
            />
            {/* Admin page (requires admin role) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            {/* Add other INTERNAL app routes here */}
            {/* 404 for routes *inside* the app layout */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>{" "}
          {/* End of AppLayout wrapped routes */}
          {/* Optional: A top-level 404 if route structure warrants it */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
