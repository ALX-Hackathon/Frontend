// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-neutral-darkest text-neutral-light text-center py-4 mt-auto">
      <p className="text-sm">
        © {new Date().getFullYear()} Habesha Hospitality Hub. All rights reserved.
      </p>
       {/* Add more footer content if needed */}
    </footer>
  );
};

export default Footer;