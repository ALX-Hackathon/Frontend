// src/pages/GuestFeedbackPage.jsx
import React from 'react';
import GuestFeedbackForm from '../components/feedback/GuestFeedbackForm';

const GuestFeedbackPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-darkest mb-6 text-center">Share Your Experience</h1>
      <GuestFeedbackForm />
       {/* Could add QR code display here if needed */}
    </div>
  );
};

export default GuestFeedbackPage;