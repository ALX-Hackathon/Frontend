// src/components/landing/FeedbackCTASection.jsx
import React from 'react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

const FeedbackCTASection = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Check if user is logged in

  const handleFeedbackClick = () => {
    if (user) {
      // If user is logged in, go directly to the feedback form
      navigate('/feedback');
    } else {
      // If user is not logged in, redirect to login page
      // Pass the target feedback page in state so login can redirect back
      navigate('/login', { state: { from: { pathname: '/feedback' } } });
    }
  };

  return (
    <div className="bg-primary-dark py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
           Your Feedback Matters
        </h2>
         <p className="text-lg text-primary-light max-w-2xl mx-auto mb-8">
          Help us improve your next stay. Share your thoughts and experiences with us easily and quickly.
         </p>
         <Button
            variant="outline" // Make it stand out on dark background
            size="lg"
             className="border-white text-white hover:bg-white hover:text-primary-dark transition-colors"
             onClick={handleFeedbackClick} // Use the handler
         >
           {user ? 'Go to Feedback Form' : 'Give Feedback Now'}
         </Button>
       </div>
    </div>
  );
};

export default FeedbackCTASection;