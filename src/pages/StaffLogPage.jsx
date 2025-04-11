// src/pages/StaffLogPage.jsx
import React from 'react';
import StaffLogForm from '../components/feedback/StaffLogForm';

const StaffLogPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-darkest mb-6 text-center">Staff: Log Observed Feedback</h1>
      <StaffLogForm />
    </div>
  );
};

export default StaffLogPage;