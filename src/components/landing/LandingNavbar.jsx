import React, { useState } from 'react';
import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { FaBars, FaTimes } from 'react-icons/fa';

const LandingNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Floating navbar classes
  const navbarClasses = `fixed  w-[95%] m-5 z-50 bg-white shadow-md  transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'top-0' : 'top-0 sm:top-0'} rounded-[40px]`;

  // NavLink styling function
  const getNavLinkClass = ({ isActive }) => {
    const baseStyle = `block sm:inline-block px-3 py-2 rounded-md text-sm font-medium text-neutral-darker hover:text-primary hover:bg-blue-50 transition-colors duration-150`;
    const activeStyle = 'text-primary font-semibold';
    return isActive ? `${baseStyle} ${activeStyle}` : baseStyle;
  };

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">

          {/* Logo / Branding */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <span className="text-lg md:text-xl font-bold text-primary-dark">
                Habesha Hub
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-darker hover:text-primary hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="landing-mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <FaTimes className="block h-6 w-6" aria-hidden="true" /> : <FaBars className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-1 md:space-x-4">
            <NavLink to="/" className={getNavLinkClass} end> Home </NavLink>
            <NavLink to="/about" className={getNavLinkClass}> About </NavLink>
            <NavLink to="/rooms" className={getNavLinkClass}> Rooms </NavLink>
            <NavLink to="/contact" className={getNavLinkClass}> Contact </NavLink>

            {/* Auth section */}
            <div className='hidden sm:ml-4 sm:flex sm:items-center'>
              {user ? (
                <div className='flex items-center space-x-3'>
                  <span className="text-xs hidden md:inline text-neutral-darker">Welcome, {user.name}!</span>
                  <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/login')} size="sm" variant="primary">
                  Login
                </Button>
              )}
            </div>
          </div>

        </div> {/* End Flex container */}
      </div> {/* End Container */}

      {/* Mobile Menu Panel */}
      <div
        id="landing-mobile-menu"
        className={`sm:hidden bg-white border-t border-neutral-light overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100 shadow-lg' : 'max-h-0 opacity-0'
          }`}
      >
        <div className={`${isMobileMenuOpen ? 'px-2 pt-2 pb-3 space-y-1' : 'p-0'}`}>
          <NavLink to="/" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-darker hover:text-primary hover:bg-blue-50" end onClick={closeMobileMenu}> Home </NavLink>
          <NavLink to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-darker hover:text-primary hover:bg-blue-50" onClick={closeMobileMenu}> About </NavLink>
          <NavLink to="/rooms" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-darker hover:text-primary hover:bg-blue-50" onClick={closeMobileMenu}> Rooms </NavLink>
          <NavLink to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-darker hover:text-primary hover:bg-blue-50" onClick={closeMobileMenu}> Contact </NavLink>

          <hr className="my-3 border-neutral" />

          {/* Mobile Auth Section */}
          {user ? (
            <div className='px-1 py-2 space-y-2'>
              <span className='text-sm text-neutral-darker block px-2'>Logged in as: <span className="font-medium">{user.name}</span></span>
              <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">Logout</Button>
            </div>
          ) : (
            <div className='px-1 py-2'>
              <Button onClick={() => { navigate('/login'); closeMobileMenu(); }} size="sm" variant="primary" className="w-full">Login</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;