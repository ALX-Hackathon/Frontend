// src/components/layout/AppNavbar.jsx
// This is the standard Navbar for INTERNAL application pages.
import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth"; // Corrected path assuming hooks folder structure
import Button from "../ui/Button";
import { FaBars, FaTimes } from "react-icons/fa";

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  }; // Simple logout and redirect
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Standard link styles for solid background navbar
  const linkStyle =
    "block sm:inline-block px-3 py-2 rounded-md text-sm font-medium text-neutral-darker hover:text-primary hover:bg-blue-50 transition-colors duration-150";
  const activeLinkStyle = "bg-primary-light text-primary-dark font-semibold"; // Standard active style
  const getNavLinkClass = ({ isActive }) =>
    isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle;

  return (
    // Always solid background and shadow
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Branding */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={closeMobileMenu}
          >
            <span className="text-lg md:text-xl font-bold text-primary-dark">
              Habesha Hub
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-dark hover:text-primary focus:ring-2 focus:ring-primary"
              aria-controls="app-mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-1 md:space-x-4">
            {/* Adjust links relevant to INTERNAL app context */}
            <NavLink to="/" className={getNavLinkClass} end>
              {" "}
              Home{" "}
            </NavLink>{" "}
            {/* May link back to Landing or an internal Dashboard? Decide this */}
            {user && (
              <NavLink to="/feedback" className={getNavLinkClass}>
                Give Feedback
              </NavLink>
            )}
            {user?.role === "staff" && (
              <NavLink to="/staff/log" className={getNavLinkClass}>
                Log Feedback
              </NavLink>
            )}
            {user?.role === "admin" && (
              <NavLink to="/admin/dashboard" className={getNavLinkClass}>
                Admin Dashboard
              </NavLink>
            )}
            {/* Add other internal app links */}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden sm:ml-4 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-neutral-dark hidden md:inline">
                  Welcome, {user.name}!
                </span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                size="sm"
                variant="primary"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        id="app-mobile-menu"
        className={`sm:hidden bg-white border-t border-neutral-light overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100 shadow-lg"
            : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`${isMobileMenuOpen ? "px-2 pt-2 pb-3 space-y-1" : "p-0"}`}
        >
          {/* --- Mobile links for INTERNAL app --- */}
          {(() => {
            const mobileLinkStyle =
              "block px-3 py-2 rounded-md text-base font-medium text-neutral-darker hover:text-primary hover:bg-blue-50";
            const mobileActiveLinkStyle =
              "bg-primary-light text-primary-dark font-semibold";
            const getMobileNavLinkClass = ({ isActive }) =>
              isActive
                ? `${mobileLinkStyle} ${mobileActiveLinkStyle}`
                : mobileLinkStyle;
            return (
              <>
                <NavLink
                  to="/"
                  className={getMobileNavLinkClass}
                  end
                  onClick={closeMobileMenu}
                >
                  {" "}
                  Home{" "}
                </NavLink>
                {user && (
                  <NavLink
                    to="/feedback"
                    className={getMobileNavLinkClass}
                    onClick={closeMobileMenu}
                  >
                    {" "}
                    Give Feedback{" "}
                  </NavLink>
                )}
                {user?.role === "staff" && (
                  <NavLink
                    to="/staff/log"
                    className={getMobileNavLinkClass}
                    onClick={closeMobileMenu}
                  >
                    {" "}
                    Log Feedback{" "}
                  </NavLink>
                )}
                {user?.role === "admin" && (
                  <NavLink
                    to="/admin/dashboard"
                    className={getMobileNavLinkClass}
                    onClick={closeMobileMenu}
                  >
                    {" "}
                    Admin Dashboard{" "}
                  </NavLink>
                )}
              </>
            );
          })()}
          {/* --- End Mobile Links --- */}
          <hr className="my-3 border-neutral" />
          {/* Mobile Auth */}
          {user ? (
            <div className="px-1 py-2 space-y-2">...</div>
          ) : (
            <div className="px-1 py-2">...</div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
