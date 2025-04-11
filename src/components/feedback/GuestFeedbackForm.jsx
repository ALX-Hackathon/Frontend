// src/components/feedback/GuestFeedbackForm.jsx
import React, { useState } from 'react';
import useApi from '../../hooks/useApi';
import { API_BASE_URL } from '../../config/api';
import toast from 'react-hot-toast'; // Import toast

// Import UI components
import Card from '../ui/Card';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';
import Alert from '../ui/Alert'; // Keep Alert for potential persistent form-level errors
import { FaStar } from 'react-icons/fa';

function GuestFeedbackForm() {
  const { isLoading: isSubmitting, request: submitFeedback, setError: setSubmitErrorHook } = useApi();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [language, setLanguage] = useState('ENG'); // 'ENG' or 'AMH'
  const [roomNumber, setRoomNumber] = useState('');
  const [formErrors, setFormErrors] = useState({}); // For inline validation messages

  // Reset error state if used
  const setCombinedError = (message) => {
    toast.error(message || 'An unexpected error occurred.');
    setSubmitErrorHook(message);
  };

  const validateForm = () => {
    const errors = {};
    if (rating === 0) {
        // Displaying specific rating error inline is hard with stars, show generic msg or rely on submit button disabled state
        // Maybe add error below stars:
         errors.rating = 'Rating is required.';
    }
    if (comment.trim().length === 0) { // Basic check for comment presence
       errors.comment = 'Comment cannot be empty.';
    } else if (comment.trim().length > 1000) { // Example length limit
        errors.comment = 'Comment cannot exceed 1000 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLanguageToggle = (lang) => {
    setLanguage(lang);
    setFormErrors({}); // Clear errors on language change
    setSubmitErrorHook(null); // Clear API error state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitErrorHook(null);

    if (!validateForm()) {
      // Optional: toast error about validation, or let inline errors show
      // toast.error("Please fix the errors below.");
      return;
    }

    if (isSubmitting) return;

    const payload = { rating, comment, roomNumber: roomNumber || undefined, language, source: 'Guest' };
    const config = { method: 'post', url: `${API_BASE_URL}/feedback/guest`, data: payload };

    try {
      const successData = await submitFeedback(config); // Pass config

      if (successData !== null) {
          toast.success(language === 'ENG' ? 'Feedback submitted!' : 'አስተያየትዎ ገብቷል!');
          // Reset form
          setRating(0);
          setComment('');
          setRoomNumber('');
          setFormErrors({});
      } else {
           // Error state is managed by the hook, but maybe trigger generic toast if no specific message
          // Toast error would have been shown by the hook if err.response.data.message existed
          // Otherwise, show a fallback
          // Removed redundant setCombinedError as hook should handle it now
          toast.error(language === 'ENG' ? 'Submission failed. Please try again.' : 'አልተሳካም።');
      }

    } catch (err) { // Should be rare if useApi catches properly
      console.error("Direct submission error:", err);
      toast.error(language === 'ENG' ? 'An unexpected error occurred.' : 'ያልተጠበቀ ስህተት ገጥሟል።');
    }
  };


  const labels = {
    ENG: { title: "Guest Feedback", rate: "Rate your experience:", room: "Room/Table # (Optional)", comment: "Your Comments:", submit: "Submit Feedback", submitting: "Submitting...", eng: "ENG", amh: "አማ", },
    AMH: { title: "የእንግዳ አስተያየት", rate: "ደረጃ ይስጡ:", room: "ክፍል/ጠረጴዛ ቁጥር (አማራጭ)", comment: "አስተያየትዎ:", submit: "አስተያየት ላክ", submitting: "እየገባ ነው...", eng: "ENG", amh: "አማ", }
  };
  const currentLabels = labels[language];

  return (
    <Card title={currentLabels.title} titleActions={
      <div>
        <Button onClick={() => handleLanguageToggle('ENG')} variant={language === 'ENG' ? 'primary' : 'ghost'} size="sm" className='mr-1'> {currentLabels.eng} </Button>
        <Button onClick={() => handleLanguageToggle('AMH')} variant={language === 'AMH' ? 'primary' : 'ghost'} size="sm"> {currentLabels.amh} </Button>
      </div>
    }>
      <form onSubmit={handleSubmit} noValidate> {/* Add noValidate to prevent default HTML5 validation */}

        {/* Optional: Form level error if not handled inline */}
         {Object.keys(formErrors).length > 0 && !formErrors.comment && !formErrors.rating && (
            <Alert type="error" message="Please review the errors below." className="mb-4" />
          )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-darker mb-2">{currentLabels.rate}</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
               <FaStar
                key={star}
                className={`cursor-pointer text-3xl transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-neutral'}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${star} out of 5 stars`} // Accessibility
              />
            ))}
          </div>
           {formErrors.rating && <p className='text-xs text-error mt-1'>{formErrors.rating}</p>}
        </div>

        <Input
          id="roomNumber"
          label={currentLabels.room}
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          // error={formErrors.roomNumber} // Uncomment if adding room validation
        />

        <Textarea
          id="comment"
          label={currentLabels.comment}
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={language === 'ENG' ? 'Enter your comments here...' : 'አስተያየትዎን እዚህ ያስገቡ...'}
          error={formErrors.comment} // Show validation error inline
          required // Add HTML required (basic)
          aria-describedby="comment-error" // Accessibility link to error message
        />
         {formErrors.comment && <p id="comment-error" className="sr-only">{formErrors.comment}</p>}


        <Button
          type="submit"
          variant='primary'
          disabled={isSubmitting} // Allow submission even if rating=0 to trigger validation msg
          isLoading={isSubmitting}
          className="w-full mt-4"
        >
          {isSubmitting ? currentLabels.submitting : currentLabels.submit}
        </Button>
      </form>
    </Card>
  );
}

export default GuestFeedbackForm;