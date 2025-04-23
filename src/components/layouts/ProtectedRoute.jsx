// src/layouts/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth'; // Adjust the import path as necessary
import Spinner from '../../components/ui/Spinner'; // Assuming you have a Spinner component

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className='flex justify-center items-center h-screen'><Spinner /></div>; // Show loading indicator while checking auth
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they
    // log in, which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect them to a suitable page if they don't have access
    // Could be a specific 'Unauthorized' page or back to home
    console.warn(`User with role '${user.role}' tried to access route restricted to '${allowedRoles.join(', ')}'`);
    return <Navigate to="/" replace />; // Or redirect to an /unauthorized page
  }

  return children; // User is authenticated and has the correct role
};

export default ProtectedRoute;