// src/components/feedback/contextual/PoolFeedbackForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import useApi from '../../../hooks/useApi'; // Adjust path
import { API_BASE_URL } from '../../../config/api'; // Adjust path
import toast from 'react-hot-toast';
import Card from '../../ui/Card'; // Adjust path
import Button from '../../ui/Button'; // Adjust path
import Textarea from '../../ui/Textarea'; // Adjust path
import StarRatingInputHelper from './StarRatingInputHelper';

const PoolFeedbackForm = ({ context }) => {
    // context might include id like 'poolside_cabana' or just loc='pool'
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
         defaultValues: { // Add default values
            poolCleanliness: 0,
            seatingAvailability: 0,
            towelAvailability: 0,
            poolAmbiance: 0,
            amenityComments: '',
         }
    });
    const { isLoading, request: submitFeedback } = useApi();
    const areaName = context.loc === 'pool' ? 'Pool Area' : context.id ? `Area: ${context.id}` : 'Hotel Amenities'; // Customize title based on context

    const onSubmit = async (data) => {
        const payload = { ...data, context, source: 'Guest', feedbackArea: context.loc || 'Amenity' }; // Use loc as feedbackArea
        const config = { method: 'post', url: `${API_BASE_URL}/feedback/contextual`, data: payload };
        const success = await submitFeedback(config);
        if (success) {
            toast.success(`Thank you for feedback on the ${areaName}!`);
            reset();
        } else {
            toast.error("Failed to submit feedback.");
        }
    };

    return (
        <Card title={`${areaName} Feedback`}>
            <p className="text-sm text-neutral-dark mb-4">Please share your experience regarding the {areaName.toLowerCase()}.</p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                 <StarRatingInputHelper name="poolCleanliness" control={control} label="Cleanliness (Water & Area)" rules={{ required: true, min: 1 }} />
                 <StarRatingInputHelper name="seatingAvailability" control={control} label="Availability of Chairs / Cabanas" />
                 <StarRatingInputHelper name="towelAvailability" control={control} label="Towel Availability & Quality" />
                 <StarRatingInputHelper name="poolAmbiance" control={control} label="Overall Atmosphere" />
                 <Textarea
                    id="amenityComments"
                    label="Additional Comments (Optional)"
                    rows={3}
                    {...register("amenityComments", { maxLength: 500 })}
                     placeholder="Any issues or suggestions regarding the pool area, staff, or facilities?"
                     error={errors.amenityComments?.message}
                />
                <Button type="submit" isLoading={isLoading} disabled={isLoading} variant="primary" className="w-full mt-4" size="lg">
                     Submit Feedback
                </Button>
            </form>
        </Card>
    );
};
export default PoolFeedbackForm;