// src/components/landing/LandingNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
// Authentication related imports removed
import { FaBars, FaTimes } from 'react-icons/fa';

/**
 * Landing Navbar - Floating Style without Login/Logout Buttons.
 * Desktop links are positioned to the RIGHT.
 */
const LandingNavbar = () => {
  const location = useLocation(); // Hook to detect route changes
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to explicitly close the mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu automatically when the route changes
  useEffect(() => {
    closeMobileMenu(); // Close menu on navigation
  }, [location]); // Re-run when location changes

  // --- Floating navbar classes (as provided by user) ---
  const navbarClasses = `fixed w-[95%] m-5 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out rounded-[40px]`;

  // --- NavLink Styling (Solid background context) ---
  const linkStyle = "block sm:inline-block px-3 py-2 rounded-md text-sm font-medium text-neutral-darker hover:text-primary hover:bg-blue-50 transition-colors duration-150";
  const activeLinkStyle = "text-primary font-semibold"; // Active state style
  const getNavLinkClass = ({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle;

  // --- Mobile Link styling ---
  const mobileLinkStyle = "block px-3 py-2 rounded-md text-base font-medium text-neutral-darker hover:text-primary hover:bg-blue-50";
  const mobileActiveLinkStyle = "bg-primary-light text-primary-dark font-semibold";
  const getMobileNavLinkClass = ({isActive}) => isActive ? `${mobileLinkStyle} ${mobileActiveLinkStyle}`: mobileLinkStyle;

  return (
    // Apply the floating navbar styles
    <nav className={navbarClasses}>
      {/* Container to manage content padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main flex container: Logo on left, Links+Mobile Button on right */}
        <div className="relative flex items-center justify-between h-14 md:h-16">

          {/* Logo / Branding (Aligned Left) */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <span className="text-lg md:text-xl font-bold text-primary-dark">
                Habesha Hub
              </span>
            </Link>
          </div>

          {/* Right Side Group: Contains Desktop Links and Mobile Button */}
          <div className="flex items-center">
            {/* Desktop Navigation Links - Aligned Right */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-1 md:space-x-4">
               <NavLink to="/" className={getNavLinkClass} end> Home </NavLink>
               <NavLink to="/about" className={getNavLinkClass}> About </NavLink>
               <NavLink to="/rooms" className={getNavLinkClass}> Rooms </NavLink>
               <NavLink to="/contact" className={getNavLinkClass}> Contact </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden ml-4"> {/* Add margin left for spacing from potential links */}
                <button
                 onClick={() => setIsMobileMenuOpen(prev => !prev)} // Toggle state
                 type="button"
                 className="inline-flex items-center justify-center p-2 rounded-md text-neutral-darker hover:text-primary hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                 aria-controls="landing-mobile-menu"
                 aria-expanded={isMobileMenuOpen}
              >
                 <span className="sr-only">Open main menu</span>
                 {isMobileMenuOpen ? <FaTimes className="block h-6 w-6" aria-hidden="true" /> : <FaBars className="block h-6 w-6" aria-hidden="true" />}
               </button>
             </div>
          </div>

        </div> {/* End Main Flex container */}
      </div> {/* End Container */}

      {/* Mobile Menu Panel */}
      <div
        id="landing-mobile-menu"
        className={`sm:hidden bg-white border-t border-neutral-light overflow-hidden transition-all duration-300 ease-in-out rounded-b-[40px] ${ // Inherit bottom rounding
          isMobileMenuOpen ? 'max-h-96 opacity-100 shadow-lg' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Padding applied only when open */}
        <div className={`${isMobileMenuOpen ? 'px-2 pt-2 pb-3 space-y-1' : 'p-0'}`}>
          {/* Mobile Links */}
           <NavLink to="/" className={getMobileNavLinkClass} end onClick={closeMobileMenu}> Home </NavLink>
           <NavLink to="/about" className={getMobileNavLinkClass} onClick={closeMobileMenu}> About </NavLink>
           <NavLink to="/rooms" className={getMobileNavLinkClass} onClick={closeMobileMenu}> Rooms </NavLink>
           <NavLink to="/contact" className={getMobileNavLinkClass} onClick={closeMobileMenu}> Contact </NavLink>

          {/* --- No Auth Section Needed --- */}
         </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;