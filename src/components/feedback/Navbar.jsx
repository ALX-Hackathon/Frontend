// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from '../../Hooks/useAuth'// Custom hook for authentication context
import Button from '../ui/Button'; // Custom button component
import { FaBars, FaTimes } from 'react-icons/fa'; // Hamburger and Close icons
// import Logo from '../../assets/logo.png'; // Optional logo

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to detect route changes
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu automatically when the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]); // Dependency on location means it runs on route change

  const handleLogout = () => {
    // No need to explicitly close menu here due to useEffect closing it on navigation
    logout();
    // Navigation to /login happens via navigate('/login') inside AppLayout/ProtectedRoute logic, or here if desired.
    // navigate('/login'); // Optional: navigate immediately
  };

  // Basic link style for NavLink
  const linkStyle = "block sm:inline-block px-3 py-2 rounded-md text-base sm:text-sm font-medium text-neutral-darker hover:text-primary hover:bg-blue-50 transition-colors duration-150";
  // Style applied when NavLink is active
  const activeLinkStyle = "bg-primary-light text-primary-dark font-semibold";

  // Function to combine base and active styles for NavLink className prop
  const getNavLinkClass = ({ isActive }) =>
    isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle;


  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50"> {/* Lighter shadow */}
      {/* Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container for logo, desktop links, mobile button */}
        <div className="relative flex items-center justify-between h-16">

          {/* Logo / Branding - always visible */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* <img src={Logo} alt="Habesha Hub Logo" className="h-8 w-auto" /> */}
              <span className="text-lg md:text-xl font-bold text-primary-dark">Habesha Hub</span>
            </Link>
          </div>

          {/* Mobile Menu Button - visible only on small screens */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)} // Toggle state
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-dark hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu" // Points to the panel ID
              aria-expanded={isMobileMenuOpen} // Indicates if panel is open
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" /> // Close icon
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" /> // Hamburger icon
              )}
            </button>
          </div>

          {/* Desktop Navigation Links - hidden on small screens */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-1 md:space-x-4">
             <NavLink to="/" className={getNavLinkClass} end> Home </NavLink>

             {/* Conditional Links based on user role */}
             {user && (<NavLink to="/feedback" className={getNavLinkClass}>Give Feedback</NavLink>)}
             {user && (user.role === 'staff' || user.role === 'admin') && (<NavLink to="/staff/log" className={getNavLinkClass}>Log Feedback</NavLink>)}
             {user && user.role === 'admin' && (<NavLink to="/admin/dashboard" className={getNavLinkClass}>Admin Dashboard</NavLink>)}

            {/* Desktop Auth Section */}
            <div className='hidden sm:ml-4 sm:flex sm:items-center'> {/* Use hidden/sm:flex here too */}
                {user ? (
                   <div className='flex items-center space-x-3'>
                     <span className='text-xs text-neutral-dark hidden md:inline'>Welcome, {user.name}!</span>
                     <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
                   </div>
                 ) : (
                    <Button onClick={() => navigate('/login')} size="sm" variant="primary">Login</Button>
                )}
            </div>
          </div>

        </div> {/* End Flex container */}
      </div> {/* End Container */}

      {/* Mobile Menu Panel - Conditionally rendered based on state */}
      {/* Transition classes for smooth opening/closing - optional but nice */}
      <div
          id="mobile-menu" // ID for aria-controls
          className={`sm:hidden border-t border-neutral-light overflow-hidden transition-all duration-300 ease-in-out ${
             isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0' // Use max-h and opacity for transition
          }`}
        >
          {/* Add padding only when menu is intended to be visible to avoid jump */}
         <div className={`${isMobileMenuOpen ? 'px-2 pt-2 pb-3 space-y-1' : 'p-0'}`}>
            {/* Mobile Links - Use getNavLinkClass which already has 'block' implicit due to space-y parent */}
            <NavLink to="/" className={getNavLinkClass} end> Home </NavLink>
            {user && (<NavLink to="/feedback" className={getNavLinkClass}>Give Feedback</NavLink>)}
            {user && (user.role === 'staff' || user.role === 'admin') && (<NavLink to="/staff/log" className={getNavLinkClass}>Log Feedback</NavLink>)}
            {user && user.role === 'admin' && (<NavLink to="/admin/dashboard" className={getNavLinkClass}>Admin Dashboard</NavLink>)}

             <hr className="my-3 border-neutral"/> {/* Adjusted margin */}

             {/* Mobile Auth Section */}
            {user ? (
                 <div className='px-1 py-2 space-y-2'>
                     <span className='text-sm text-neutral-darker block px-2'>Logged in as: <span className="font-medium">{user.name}</span> ({user.role})</span>
                   <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">Logout</Button>
                 </div>
               ) : (
                  <div className='px-1 py-2'>
                     <Button onClick={() => navigate('/login')} size="sm" variant="primary" className="w-full">Login</Button>
                 </div>
            )}
         </div>
      </div>
    </nav>
  );
};

export default Navbar;