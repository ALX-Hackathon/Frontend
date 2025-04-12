// src/components/feedback/GuestFeedbackForm.jsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form'; // Import react-hook-form
import useApi from '../../hooks/useApi';
import { API_BASE_URL } from '../../config/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth'; // Needed if associating feedback with user

// Import UI components
import Card from '../ui/Card';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import { FaStar, FaCamera, FaTimesCircle } from 'react-icons/fa';

// Helper component for Star Rating with react-hook-form Controller
const StarRatingInput = ({ name, control, rules, label }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={0} // Initial value
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${error ? 'text-error' : 'text-neutral-darker'}`}>
             {label} {rules?.required && <span className="text-error">*</span>}
          </label>
          <div className="flex space-x-1.5 items-center">
             {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                 key={star}
                 className={`cursor-pointer text-3xl transition-colors duration-150 ${
                    (hoverRating || value) >= star
                    ? 'text-yellow-400 hover:text-yellow-500'
                     : 'text-neutral hover:text-neutral-med'
                  }`}
                 onClick={() => onChange(star)} // Update form state on click
                 onMouseEnter={() => setHoverRating(star)}
                 onMouseLeave={() => setHoverRating(0)}
                 aria-label={`Rate ${star} out of 5 stars`}
               />
            ))}
             {/* Optional: Show selected rating */}
            {value > 0 && <span className='text-sm text-neutral-dark ml-2'>({value})</span>}
           </div>
           {error && <p className="text-xs text-error mt-1">{error.message || 'Rating is required'}</p>}
         </div>
       )}
    />
  );
};


function GuestFeedbackForm() {
  const { user } = useAuth(); // Get user info if logged in
  const { isLoading: isSubmitting, request: submitFeedback, setError: setApiError } = useApi();

  const { register, handleSubmit, control, reset, formState: { errors, isValid } } = useForm({
      mode: 'onChange', // Validate on change after first submit attempt potentially
      defaultValues: {
         overallRating: 0,
         feedbackType: '',
         roomCleanliness: 0, roomComfort: 0, roomNoise: 0, roomComments: '',
         foodQuality: 0, foodVariety: 0, diningService: 0, diningComments: '',
         wifiRating: 0, poolRating: 0, restroomRating: 0, amenitiesComments: '',
         staffHelpfulness: 0, staffFriendliness: 0, receptionRating: 0, staffComments: '',
         valueRating: 0, // Price/Value
         otherComments: '',
         contactConsent: false, // Consent to be contacted
         // fileUpload: null // File uploads are complex, handle differently
      }
  });

  const [language, setLanguage] = useState('ENG'); // For labels, not implemented fully here yet
  const [selectedFiles, setSelectedFiles] = useState([]); // State for simulated file upload

  const handleFileChange = (event) => {
     if (event.target.files && event.target.files.length > 0) {
         // Limit number/size if needed
         const newFiles = Array.from(event.target.files).slice(0, 3); // Example: limit to 3 files
         setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 3)); // Keep total max 3
         // In real app, upload files here or store for later upload
          toast.success(`${newFiles.length} file(s) selected (Simulated)`);
          event.target.value = null; // Reset file input
      }
   };

   const removeFile = (fileName) => {
        setSelectedFiles(prev => prev.filter(f => f.name !== fileName));
   };

  const onSubmit = async (formData) => {
     console.log("Form Data:", formData);

     // ** IMPORTANT: File Handling **
      // File uploads need separate handling, usually multipart/form-data.
      // You'd typically upload files first, get their URLs/IDs, and then
      // include those references in the main feedback payload.
      // For this MVP, we'll just log selected file names and EXCLUDE file data from main submit.
      const fileNames = selectedFiles.map(f => f.name);
      console.log("Selected files (simulated):", fileNames);

     const payload = {
       ...formData,
       source: 'Guest',
        userId: user ? user.id : null, // Associate with user if logged in (Backend needs user ID handling)
        submittedAt: new Date().toISOString(),
        simulatedFileNames: fileNames, // Send filenames for logging/reference
        // Remove fileUpload field if it exists from react-hook-form data
        fileUpload: undefined
      };
       delete payload.fileUpload; // Clean up if needed

     const config = {
        method: 'post',
         // *** NOTE: Choose ONE backend endpoint. You might need a new, more complex one ***
         // url: `${API_BASE_URL}/feedback/guest`, // Original simple one
        url: `${API_BASE_URL}/feedback/detailed`, // Assumes a new endpoint capable of handling this structure
        data: payload,
     };

     try {
       const successData = await submitFeedback(config); // Use the hook

       if (successData !== null) {
          toast.success('Thank you! Your detailed feedback has been submitted.');
           reset(); // Reset form fields
           setSelectedFiles([]); // Clear file previews
       } else {
          // API Hook should handle setting error state, toast shown from there potentially
           toast.error('Submission failed. Please check details or try again.');
        }
      } catch (err) {
         console.error("Form Submission Error:", err);
         toast.error('An unexpected error occurred during submission.');
      }
  };


  return (
    <Card title="Detailed Hotel Feedback">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
         <p className="text-sm text-neutral-dark mb-4">
             We value your feedback! Please take a few moments to share your experience about different aspects of your stay.
             (<span className="text-error">*</span> indicates required fields)
         </p>

        {/* --- Overall Section --- */}
        <fieldset className="border border-neutral p-4 rounded-md">
          <legend className="text-lg font-semibold px-2 text-primary mb-2">Overall Experience</legend>
          <StarRatingInput
            name="overallRating"
            control={control}
            label="Overall Satisfaction"
            rules={{ required: "Overall rating is required", min: { value: 1, message: "Please provide a rating" } }}
           />
          <Select
             id="feedbackType"
             label="Type of Feedback"
             control={control} // If using Controller wrapper for Select
            // Use register directly if Select handles {...register(...)}
             {...register("feedbackType", { required: "Feedback type is required" })}
             options={[
                { value: 'compliment', label: 'Compliment / Praise' },
                { value: 'complaint', label: 'Complaint / Issue' },
                { value: 'suggestion', label: 'Suggestion' },
                 { value: 'general', label: 'General Comment' },
             ]}
             placeholder="Select feedback type..."
             error={errors.feedbackType?.message}
            required
         />
         <Input
             id="bookingReference"
             label="Booking Reference / Room Number (Optional)"
            {...register("bookingReference")}
             placeholder="e.g., 12345 or Room 305"
         />
        </fieldset>

         {/* --- Room Section --- */}
         <fieldset className="border border-neutral p-4 rounded-md space-y-4">
          <legend className="text-lg font-semibold px-2 text-primary mb-2">Room</legend>
            <StarRatingInput name="roomCleanliness" control={control} label="Cleanliness" />
            <StarRatingInput name="roomComfort" control={control} label="Comfort (Bed, Temperature)" />
            <StarRatingInput name="roomNoise" control={control} label="Noise Level" />
            <Textarea
               id="roomComments"
               label="Comments about the Room"
               rows={3}
               {...register("roomComments", { maxLength: { value: 500, message: "Max 500 characters"}})}
               placeholder="Any specific comments about your room?"
               error={errors.roomComments?.message}
             />
        </fieldset>

        {/* --- Dining Section --- */}
         <fieldset className="border border-neutral p-4 rounded-md space-y-4">
            <legend className="text-lg font-semibold px-2 text-primary mb-2">Dining / Food & Beverage</legend>
            <StarRatingInput name="foodQuality" control={control} label="Food Quality" />
            <StarRatingInput name="foodVariety" control={control} label="Menu Variety" />
             <StarRatingInput name="diningService" control={control} label="Service (Restaurant/Bar Staff)" />
            <Textarea
               id="diningComments"
                label="Comments about Dining"
                rows={3}
                 {...register("diningComments", { maxLength: { value: 500, message: "Max 500 characters"}})}
                placeholder="Feedback on breakfast, restaurants, room service, etc."
                error={errors.diningComments?.message}
            />
        </fieldset>

         {/* --- Amenities Section --- */}
         <fieldset className="border border-neutral p-4 rounded-md space-y-4">
            <legend className="text-lg font-semibold px-2 text-primary mb-2">Amenities & Facilities</legend>
            <StarRatingInput name="wifiRating" control={control} label="Wi-Fi Quality/Speed" />
            <StarRatingInput name="poolRating" control={control} label="Swimming Pool (if applicable)" />
             <StarRatingInput name="restroomRating" control={control} label="Public Restroom Cleanliness" />
             {/* Add more ratings: Gym, Spa, Business Center etc. */}
            <Textarea
               id="amenitiesComments"
                label="Comments about Amenities"
                rows={3}
                {...register("amenitiesComments", { maxLength: { value: 500, message: "Max 500 characters"}})}
                placeholder="Feedback on pool, Wi-Fi, gym, public areas, etc."
                 error={errors.amenitiesComments?.message}
             />
        </fieldset>

        {/* --- Staff & Service Section --- */}
         <fieldset className="border border-neutral p-4 rounded-md space-y-4">
            <legend className="text-lg font-semibold px-2 text-primary mb-2">Staff & Service</legend>
            <StarRatingInput name="staffHelpfulness" control={control} label="Staff Helpfulness" />
             <StarRatingInput name="staffFriendliness" control={control} label="Staff Friendliness/Attitude" />
            <StarRatingInput name="receptionRating" control={control} label="Reception / Check-in / Check-out Process" />
            {/* Could add input for specific staff mentions */}
            <Input
                 id="staffMention"
                label="Mention specific staff? (Optional)"
                {...register("staffMention")}
                 placeholder="Staff name or description"
             />
             <Textarea
               id="staffComments"
                label="Comments about Staff/Service"
                rows={3}
                 {...register("staffComments", { maxLength: { value: 500, message: "Max 500 characters"}})}
                placeholder="Feedback on interactions with staff, check-in/out, concierge..."
                 error={errors.staffComments?.message}
            />
        </fieldset>

         {/* --- Value & Other --- */}
         <fieldset className="border border-neutral p-4 rounded-md space-y-4">
            <legend className="text-lg font-semibold px-2 text-primary mb-2">Value & Other</legend>
             <StarRatingInput name="valueRating" control={control} label="Value for Money" />
             <Textarea
                id="otherComments"
                label="Any Other Comments or Suggestions?"
                 rows={4}
                 {...register("otherComments", { maxLength: { value: 1000, message: "Max 1000 characters"}})}
                 placeholder="General suggestions, things missed, overall impressions..."
                 error={errors.otherComments?.message}
             />
        </fieldset>

        {/* --- File Upload Section (Simulated) --- */}
         <fieldset className="border border-neutral p-4 rounded-md">
             <legend className="text-base font-medium px-2 text-neutral-darker mb-2">Attach Photos (Optional)</legend>
             <p className="text-xs text-neutral-dark mb-3">If reporting an issue, attaching photos can help (Max 3 files, JPG/PNG). Files are NOT actually uploaded in this demo.</p>
             <div className="flex items-center gap-4">
                 <label htmlFor="file-upload" className="cursor-pointer">
                     <Button type="button" variant="outline" size="sm" as="span" className="flex items-center gap-2">
                        <FaCamera/> Select Files
                     </Button>
                     <input id="file-upload" name="fileUpload" type="file" className="sr-only" multiple accept="image/png, image/jpeg" onChange={handleFileChange} />
                </label>
                 <div className="flex flex-wrap gap-2">
                     {selectedFiles.map((file, index) => (
                         <div key={index} className="flex items-center gap-1 bg-neutral-light px-2 py-1 rounded text-xs text-neutral-darker border border-neutral">
                           <span>{file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}</span>
                             <button type="button" onClick={() => removeFile(file.name)} className="text-error hover:text-red-700">
                                 <FaTimesCircle/>
                             </button>
                         </div>
                     ))}
                 </div>
            </div>
        </fieldset>

        {/* --- Consent --- */}
         <div className="relative flex items-start mt-4">
            <div className="flex h-5 items-center">
                 <input
                    id="contactConsent"
                     aria-describedby="contactConsent-description"
                    {...register("contactConsent")} // Register checkbox
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral text-primary focus:ring-primary"
                 />
             </div>
             <div className="ml-3 text-sm">
                 <label htmlFor="contactConsent" className="font-medium text-neutral-darker">Contact Consent</label>
                 <p id="contactConsent-description" className="text-neutral-dark text-xs">
                     Check this box if you would like to allow hotel management to contact you regarding your feedback (if necessary).
                </p>
             </div>
         </div>

        {/* --- Submission Button --- */}
         <Button
             type="submit"
             variant='primary'
             disabled={isSubmitting}
             isLoading={isSubmitting}
             className="w-full md:w-auto mt-6" // Adjust width on larger screens
             size="lg"
         >
            Submit Detailed Feedback
        </Button>

        {/* Show API error message persistently if it occurs */}
         {/* The useApi hook now manages error state, but we might want a specific display area */}
        {/* {apiError && <Alert type="error" title="Submission Error" message={apiError} className="mt-4" />} */}

       </form>
     </Card>
   );
}

export default GuestFeedbackForm;