// src/components/feedback/contextual/DiningFeedbackForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import useApi from "../../../Hooks/useApi"; // Adjust path
import { API_BASE_URL } from "../../../config/api"; // Adjust path
import toast from "react-hot-toast";
import Card from "../../ui/Card"; // Adjust path
import Button from "../../ui/Button"; // Adjust path
import Textarea from "../../ui/Textarea"; // Adjust path
import StarRatingInputHelper from "./StarRatingInputHelper";

const DiningFeedbackForm = ({ context }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // Add default values
      foodQuality: 0,
      serviceSpeed: 0,
      staffAttentiveness: 0,
      ambianceRating: 0,
      diningComments: "",
    },
  });
  const { isLoading, request: submitFeedback } = useApi();
  const locationIdentifier = context.id
    ? `at ${context.id}`
    : "in our dining area";

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      context,
      source: "Guest",
      feedbackArea: "Dining",
    };
    const config = {
      method: "post",
      url: `${API_BASE_URL}/feedback/contextual`,
      data: payload,
    };
    const success = await submitFeedback(config);
    if (success) {
      toast.success(
        `Thank you for your feedback about dining ${locationIdentifier}!`
      );
      reset();
    } else {
      toast.error("Failed to submit feedback.");
    }
  };

  return (
    <Card title={`Dining Feedback (${locationIdentifier})`}>
      <p className="text-sm text-neutral-dark mb-4">
        How was your dining experience {locationIdentifier}? Please rate the
        following:
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Use rules={{required: true, min: 1}} where applicable */}
        <StarRatingInputHelper
          name="foodQuality"
          control={control}
          label="Food Quality"
          rules={{ required: true, min: 1 }}
        />
        <StarRatingInputHelper
          name="serviceSpeed"
          control={control}
          label="Speed of Service"
        />
        <StarRatingInputHelper
          name="staffAttentiveness"
          control={control}
          label="Staff Attentiveness / Friendliness"
          rules={{ required: true, min: 1 }}
        />
        <StarRatingInputHelper
          name="ambianceRating"
          control={control}
          label="Ambiance / Atmosphere"
        />
        <Textarea
          id="diningComments"
          label="Specific Comments (Optional)"
          rows={3}
          {...register("diningComments", { maxLength: 500 })}
          placeholder="Dishes you enjoyed or disliked? Service details? Atmosphere?"
          error={errors.diningComments?.message}
        />
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          variant="primary"
          className="w-full mt-4"
          size="lg"
        >
          Submit Dining Feedback
        </Button>
      </form>
    </Card>
  );
};
export default DiningFeedbackForm;
