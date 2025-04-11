// src/components/feedback/StaffLogForm.jsx
import React, { useState } from 'react';
import useApi from '../../hooks/useApi';
import { API_BASE_URL } from '../../config/api';
import toast from 'react-hot-toast';

// Import UI components
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert'; // Keep for persistent errors if needed

function StaffLogForm() {
  const { isLoading: isSubmitting, request: submitFeedback, setError: setSubmitErrorHook } = useApi();
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState(''); // Low, Medium, High
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const categoryOptions = [
    { value: 'Room', label: 'Room / ክፍል' },
    { value: 'Food', label: 'Food / ምግብ' },
    { value: 'Service', label: 'Service / አገልግሎት' },
    { value: 'Maintenance', label: 'Maintenance / ጥገና' },
    { value: 'Other', label: 'Other / ሌላ' },
  ];
   const severityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
   ];

  const validateForm = () => {
      const errors = {};
      if (!category) errors.category = "Category is required.";
      if (!severity) errors.severity = "Severity is required.";
      if (details.trim().length === 0) errors.details = "Details cannot be empty.";
      if (details.trim().length > 1000) errors.details = 'Details cannot exceed 1000 characters.';
       // Add location validation if needed
       // if (!location.trim()) errors.location = "Location is required.";

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitErrorHook(null);

    if (!validateForm()) {
        // toast.error("Please fill all required fields.");
        return;
    }

    if (isSubmitting) return;

    const payload = { category, severity, location, details, source: 'Staff' };
    const config = { method: 'post', url: `${API_BASE_URL}/feedback/staff`, data: payload };

     try {
       const successData = await submitFeedback(config); // Use the request function

       if (successData !== null) {
          toast.success('Feedback logged successfully!');
           // Reset form
           setCategory('');
           setSeverity('');
           setLocation('');
           setDetails('');
           setFormErrors({});
       } else {
           // Hook handled showing specific error message via toast if possible
           // Show fallback generic error if hook didn't set one (less likely now)
            toast.error('Failed to log feedback. Please try again.');
       }
    } catch (err) { // Catch rare unexpected errors
       console.error("Direct submission error:", err);
       toast.error('An unexpected error occurred while logging.');
    }
  };


  return (
    <Card title="Log Verbal/Observed Feedback">
      <form onSubmit={handleSubmit} noValidate>

         {/* Optional: Form level error summary */}
          {Object.keys(formErrors).length > 0 && (
            <Alert type="error" message="Please fix the errors highlighted below." className="mb-4" />
          )}

        <Select
          id="category"
          label="Category / ምድብ"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          placeholder="Select category..."
          error={formErrors.category}
        />

        <Select
          id="severity"
          label="Severity / የክብደት መጠን"
          options={severityOptions}
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          required
          placeholder="Select severity..."
          error={formErrors.severity}
        />

        <Input
            id="location"
            label="Room # / Location (Optional)" // Made label optional explicitly
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Room 205, Table 3, Lobby"
            error={formErrors.location} // Show error if location validation added
        />

        <Textarea
            id="details"
            label="Details / ዝርዝሮች"
            rows="4"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
            placeholder="Describe the feedback observed or heard..."
            error={formErrors.details}
             aria-describedby="details-error"
         />
        {formErrors.details && <p id="details-error" className="sr-only">{formErrors.details}</p>}


         {/* Placeholder for Photo Upload - Non-functional */}
        <div className="my-4 text-center">
           <Button type="button" variant="ghost" size="sm" disabled className="text-neutral-dark">
                [Future] Attach Photo
           </Button>
        </div>


        <Button
          type="submit"
          variant='primary'
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="w-full mt-2"
        >
          {isSubmitting ? 'Logging...' : 'Log Entry'}
        </Button>
      </form>
    </Card>
  );
}

export default StaffLogForm;