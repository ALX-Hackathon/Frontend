// src/components/layout/AppNavbar.jsx
// Internal Application Navbar - ROLE-BASED Navigation
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Correct path
import Button from '../ui/Button'; // Correct path
import { FaBars, FaTimes } from 'react-icons/fa';

const AppNavbar = () => {
  const { user, logout } = useAuth(); // Get user role and logout function
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Standard link styles for solid background navbar
  const linkStyle = "block sm:inline-block px-3 py-2 rounded-md text-sm font-medium text-neutral-darker hover:text-primary hover:bg-blue-50 transition-colors duration-150";
  const activeLinkStyle = "bg-primary-light text-primary-dark font-semibold"; // Standard active style
  const getNavLinkClass = ({  isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle;

   // Mobile Link Styling function
   const mobileLinkStyle = "block px-3 py-2 rounded-md text-base font-medium text-neutral-darker hover:text-primary hover:bg-blue-50";
   const mobileActiveLinkStyle = "bg-primary-light text-primary-dark font-semibold";
   const getMobileNavLinkClass = ({ isActive }) => isActive ? `${mobileLinkStyle} ${mobileActiveLinkStyle}` : mobileLinkStyle;

  return (
    // Always solid background and shadow for internal app
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Branding - Link always goes to root (landing page) */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
               <span className="text-lg md:text-xl font-bold text-primary-dark">Habesha Hub</span>
               {/* Optional: Add tiny text indication if it's internal */}
               {/* {user && <span className='text-xs text-neutral-dark ml-2 hidden md:inline'>(System)</span>} */}
            </Link>
           </div>


           {/* --- Desktop Navigation Links - ROLE BASED --- */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-1 md:space-x-4">
               {/* Admin Links */}
              {user?.role === 'admin' && (
                   <>
                     <NavLink to="/admin/dashboard" className={getNavLinkClass} end>Dashboard</NavLink>
                      {/* Optionally keep staff log link for admin */}
                     <NavLink to="/staff/log" className={getNavLinkClass}>Log Entry</NavLink>
                     {/* Maybe a link to Settings? */}
                   </>
              )}

              {/* Staff Links */}
               {user?.role === 'staff' && (
                   <>
                       <NavLink to="/staff/log" className={getNavLinkClass} end>Log Feedback</NavLink>
                       {/* Can staff also give general feedback? */}
                      {/* <NavLink to="/feedback" className={getNavLinkClass}>Give Feedback</NavLink> */}
                    </>
               )}

              {/* Guest Links (Logged In) */}
               {user?.role === 'guest' && (
                   <>
                      {/* Maybe redirect guests clicking logo to /feedback or a dedicated /my-dashboard instead of home? */}
                      <NavLink to="/feedback" className={getNavLinkClass} end>Give Feedback</NavLink>
                      {/* Add other guest links if needed */}
                  </>
              )}

              {/* Display Home link ONLY if NOT Staff or Admin? Or based on where logo points? */}
               {/* {user && user.role === 'guest' && (
                   <NavLink to="/" className={getNavLinkClass} end> Home </NavLink>
               )} */}

          </div> {/* End Desktop Nav Links Section */}


           {/* Right side content: Auth state or Mobile Menu button */}
           <div className="flex items-center">
                 {/* Desktop Auth Section (Only shows Logout when user exists) */}
                <div className='hidden sm:ml-4 sm:flex sm:items-center'>
                     {user ? (
                         // REMOVED "Welcome" text
                         <Button onClick={handleLogout} variant="outline" size="sm">Logout ({user.role})</Button> // Display role for clarity? Optional.
                      ) : (
                          // No Login button needed here if pages are protected
                         // If needed for some edge case:
                         // <Button onClick={() => navigate('/login')} size="sm" variant="primary">Login</Button>
                        null // Render nothing if not logged in (pages should redirect)
                    )}
                 </div>


                {/* Mobile Menu Button */}
                 <div className="flex items-center sm:hidden ml-4"> {/* ml-4 needed if Logout button present */}
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-neutral-dark hover:text-primary focus:ring-2 focus:ring-primary" aria-controls="app-mobile-menu" aria-expanded={isMobileMenuOpen}>
                      <span className="sr-only">Open main menu</span>
                       {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                    </button>
                 </div>
           </div>


         </div>
      </div>

       {/* Mobile Menu Panel - ROLE BASED */}
       <div id="app-mobile-menu" className={`sm:hidden bg-white border-t border-neutral-light overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100 shadow-lg' : 'max-h-0 opacity-0'}`}>
          <div className={`${isMobileMenuOpen ? 'px-2 pt-2 pb-3 space-y-1' : 'p-0'}`}>
              {/* Conditionally render mobile links based on role */}

              {user?.role === 'admin' && (
                   <>
                     <NavLink to="/admin/dashboard" className={getMobileNavLinkClass} end onClick={closeMobileMenu}>Dashboard</NavLink>
                      <NavLink to="/staff/log" className={getMobileNavLinkClass} onClick={closeMobileMenu}>Log Entry</NavLink>
                 </>
              )}
              {user?.role === 'staff' && (
                   <>
                      <NavLink to="/staff/log" className={getMobileNavLinkClass} end onClick={closeMobileMenu}>Log Feedback</NavLink>
                      {/* <NavLink to="/feedback" className={getMobileNavLinkClass} onClick={closeMobileMenu}>Give Feedback</NavLink> */}
                 </>
              )}
              {user?.role === 'guest' && (
                  <>
                      <NavLink to="/feedback" className={getMobileNavLinkClass} end onClick={closeMobileMenu}>Give Feedback</NavLink>
                     {/* <NavLink to="/" className={getMobileNavLinkClass} end onClick={closeMobileMenu}> Home </NavLink> */}
                 </>
              )}

               {/* Mobile Auth (Shows only Logout button when logged in) */}
               {user && (
                  <>
                     <hr className="my-3 border-neutral"/>
                    <div className='px-1 py-2 space-y-2'>
                       {/* Removed Welcome text */}
                       <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">Logout ({user.role})</Button>
                    </div>
                  </>
              )}
              {/* No need for mobile login button if handled by redirects */}

            </div>
       </div>
    </nav>
  );
};

export default AppNavbar;