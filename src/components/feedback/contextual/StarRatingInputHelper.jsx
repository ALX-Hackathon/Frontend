// src/components/feedback/contextual/StarRatingInputHelper.jsx
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { FaStar } from 'react-icons/fa';

/**
 * Helper component for star rating integrated with react-hook-form Controller.
 */
const StarRatingInputHelper = ({ name, control, rules = {}, label }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        // Use Controller to connect to react-hook-form state
        <Controller
            name={name}
            control={control}
            rules={rules} // Pass validation rules here
            defaultValue={0} // Important: Set a default value for controlled component
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <div className="mb-4">
                    {/* Label with optional required indicator */}
                    <label className={`block text-sm font-medium mb-2 ${error ? 'text-error' : 'text-neutral-darker'}`}>
                        {label} {rules.required && <span className="text-error">*</span>}
                    </label>
                    {/* Star rendering */}
                    <div className="flex space-x-1.5 items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`cursor-pointer text-3xl transition-colors duration-150 ${
                                    (hoverRating || value) >= star
                                    ? 'text-yellow-400 hover:text-yellow-500' // Filled star style
                                    : 'text-neutral hover:text-neutral-med'   // Empty star style
                                }`}
                                onClick={() => onChange(star)} // Call RHF onChange when a star is clicked
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                aria-label={`Rate ${star} out of 5 stars`} // Accessibility
                            />
                        ))}
                        {/* Display the selected value numerically (optional) */}
                        {value > 0 && <span className='text-sm text-neutral-dark ml-2'>({value})</span>}
                    </div>
                     {/* Display validation error message */}
                    {error && <p className="text-xs text-error mt-1">{error.message || 'This rating is required'}</p>}
                </div>
            )}
        />
    );
};

export default StarRatingInputHelper;