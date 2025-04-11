// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-neutral-darkest mb-4">Page Not Found</h2>
      <p className="text-neutral-dark mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/">
          <Button variant='primary'>Go Back Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;