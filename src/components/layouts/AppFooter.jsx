// src/components/layout/AppFooter.jsx
// Simpler footer for internal application pages
import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  return (
    <footer className="bg-neutral-light border-t border-neutral py-4 mt-10"> {/* Lighter background, more subtle */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center md:flex md:justify-between md:items-center">
        <p className="text-xs text-neutral-dark mb-2 md:mb-0">
           © {new Date().getFullYear()} Habesha Hospitality Hub. Internal System.
         </p>
        {/* Optional: Simplified internal links */}
         <div className="flex justify-center space-x-4">
            <Link to="/privacy" className="text-xs text-neutral-dark hover:text-primary">Privacy</Link>
             <Link to="/terms" className="text-xs text-neutral-dark hover:text-primary">Terms</Link>
            {/* Add Help/Support link if needed */}
             {/* <Link to="/support" className="text-xs text-neutral-dark hover:text-primary">Support</Link> */}
         </div>
       </div>
    </footer>
  );
};

export default AppFooter;