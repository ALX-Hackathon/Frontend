// src/components/feedback/contextual/CheckoutFeedbackForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import useApi from '../../../hooks/useApi'; // Adjusted path
import { API_BASE_URL } from '../../../config/api'; // Adjusted path
import toast from 'react-hot-toast';
import Card from '../../ui/Card'; // Adjusted path
import Button from '../../ui/Button'; // Adjusted path
import Textarea from '../../ui/Textarea'; // Adjusted path
import StarRatingInputHelper from './StarRatingInputHelper'; // Assuming helper is in this folder

const CheckoutFeedbackForm = ({ context }) => {
    // context prop contains { loc, id, token, guestName? } passed from ContextualFeedbackPage
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            checkoutSpeed: 0,
            checkoutStaffFriendliness: 0,
            billingAccuracy: 0,
            checkoutComments: '',
        }
    });
    const { isLoading, request: submitFeedback } = useApi();
    const guestName = context?.guestName ? `, ${context.guestName}` : '';

    const onSubmit = async (data) => {
        const payload = {
            ...data,        // Form data (ratings, comments)
            context,        // Include location, id, token for backend
            source: 'Guest',
            feedbackArea: 'Checkout Experience', // Specific area for this form
        };
        // Ensure context doesn't overwrite form data if names clash (unlikely here)
        // const finalPayload = { ...context, ...data, source: 'Guest', feedbackArea: 'Checkout' };


        // **IMPORTANT**: Ensure your backend endpoint can handle this nested context object
        const config = { method: 'post', url: `${API_BASE_URL}/feedback/contextual`, data: payload };

        const successData = await submitFeedback(config); // Use the request function from useApi

        if (successData !== null) { // Check if request was successful (useApi returns data or null on error)
            toast.success("Thank you for your check-out feedback!");
            reset(); // Clear the form
            // Optionally, show a success message instead of the form now
            // setShowSuccess(true); // Example state toggle
        } else {
            // useApi hook should ideally handle setting an error state that could be displayed,
            // or you can rely on its potential implicit error toasts if configured.
            toast.error("Failed to submit feedback. Please try again or contact reception.");
        }
    };

    // TODO: Handle state where form is successfully submitted (e.g., show a thank you message instead of form)
    // const [showSuccess, setShowSuccess] = useState(false);
    // if (showSuccess) { return (<Card title="Feedback Received"><p>Thank you!</p></Card>)}

    return (
        <Card title={`Check-out Feedback${guestName}`}>
             <p className="text-sm text-neutral-dark mb-4">
                 Thank you for staying with us! Please rate your recent check-out experience.
                 (<span className="text-error">*</span> indicates required fields)
             </p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 md:space-y-6">
                {/* Rating for Speed */}
                 <StarRatingInputHelper
                    name="checkoutSpeed"
                    control={control}
                    label="Speed of Check-out Process"
                    rules={{ required: "Rating required", min: { value: 1, message: "Rating required" } }}
                 />

                 {/* Rating for Staff Friendliness */}
                <StarRatingInputHelper
                    name="checkoutStaffFriendliness"
                    control={control}
                    label="Staff Friendliness (Reception)"
                    rules={{ required: "Rating required", min: { value: 1, message: "Rating required" } }}
                />

                {/* Rating for Billing Accuracy */}
                <StarRatingInputHelper
                    name="billingAccuracy"
                    control={control}
                    label="Billing Accuracy"
                    rules={{ required: "Rating required", min: { value: 1, message: "Rating required" } }}
                />

                 {/* Optional Comments */}
                 <Textarea
                    id="checkoutComments"
                    label="Additional Comments about Check-out (Optional)"
                    rows={3}
                    {...register("checkoutComments", {
                        maxLength: { value: 500, message: "Comment cannot exceed 500 characters" }
                     })}
                    placeholder="Any specific details regarding billing, staff interaction, or waiting time?"
                    error={errors.checkoutComments?.message} // Display validation errors
                />

                 {/* Submit Button */}
                <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={isLoading}
                    variant="primary"
                    className="w-full mt-4 md:w-auto md:px-10" // Add margin top
                    size="lg"
                 >
                    Submit Check-out Feedback
                 </Button>
            </form>
         </Card>
     );

     
};

export default CheckoutFeedbackForm;