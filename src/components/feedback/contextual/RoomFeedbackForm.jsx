// src/components/feedback/contextual/RoomFeedbackForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useApi from '../../../hooks/useApi'; // Adjust path if needed
import { API_BASE_URL } from '../../../config/api'; // Adjust path if needed
import toast from 'react-hot-toast';
import Card from '../../ui/Card'; // Adjust path if needed
import Button from '../../ui/Button'; // Adjust path if needed
import Textarea from '../../ui/Textarea'; // Adjust path if needed
import StarRatingInputHelper from './StarRatingInputHelper';
import { FaCamera, FaTimesCircle } from 'react-icons/fa'; // For file upload simulation

const RoomFeedbackForm = ({ context }) => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            roomCleanliness: 0,
            roomComfort: 0,
            roomNoise: 0,
            bathroomCleanliness: 0, // Added Bathroom specific
            roomAmenities: 0,        // Added Amenities specific
            roomComments: '',
            // fileUpload: null - Not handled directly by react-hook-form state
        }
    });
    const { isLoading, request: submitFeedback } = useApi();
    const [selectedFiles, setSelectedFiles] = useState([]); // For simulated uploads

    const locationIdentifier = context.id ? `for Room ${context.id}` : "about your room";

    const handleFileChange = (event) => { // Same simulation logic
       if (event.target.files) {
          const newFiles = Array.from(event.target.files).slice(0, 3);
          setSelectedFiles(prev => [...prev.filter(f => !newFiles.some(nf => nf.name === f.name)), ...newFiles].slice(0, 3)); // Avoid duplicates, limit total
          toast.success(`${newFiles.length} file(s) selected (Simulated)`);
           event.target.value = null; // Reset file input
       }
    };
    const removeFile = (fileName) => { setSelectedFiles(prev => prev.filter(f => f.name !== fileName)); };

    const onSubmit = async (data) => {
        const fileNames = selectedFiles.map(f => f.name);
        const payload = {
            ...data,
            context,
            source: 'Guest',
            feedbackArea: 'Room Experience',
            simulatedFileNames: fileNames,
        };
        const config = { method: 'post', url: `${API_BASE_URL}/feedback/contextual`, data: payload };
        const success = await submitFeedback(config);
        if (success) {
            toast.success(`Thank you for your feedback on ${locationIdentifier}!`);
            reset();
            setSelectedFiles([]);
            // Optional: Show success message instead of form
        } else {
            toast.error("Failed to submit feedback. Please try again.");
        }
    };

    return (
        <Card title={`Room Feedback (${locationIdentifier})`}>
            <p className="text-sm text-neutral-dark mb-4">Please rate different aspects of your room.</p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <StarRatingInputHelper name="roomCleanliness" control={control} label="Room Cleanliness" rules={{ required: true, min: 1 }}/>
                <StarRatingInputHelper name="roomComfort" control={control} label="Comfort (Bed, Temperature)" rules={{ required: true, min: 1 }}/>
                <StarRatingInputHelper name="roomNoise" control={control} label="Noise Level from outside/neighbors" />
                <StarRatingInputHelper name="bathroomCleanliness" control={control} label="Bathroom Cleanliness" rules={{ required: true, min: 1 }}/>
                <StarRatingInputHelper name="roomAmenities" control={control} label="In-Room Amenities (Coffee, TV, etc.)" />
                <Textarea
                    id="roomComments"
                    label="Specific Comments about the Room (Optional)"
                    rows={3}
                    {...register("roomComments", { maxLength: 500 })}
                    placeholder="Any details about cleanliness, comfort, noise, bathroom, amenities, or maintenance issues?"
                    error={errors.roomComments?.message}
                />

                {/* File Upload Section (Simulated) */}
                <fieldset className="border border-neutral-light p-3 rounded-md mt-2">
                    <legend className="text-xs font-medium px-1 text-neutral-darker">Attach Photos (Optional Issue Report)</legend>
                     <div className="flex items-center gap-4 mt-2">
                        <label htmlFor="room-file-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm" as="span" className="flex items-center gap-2">
                                <FaCamera/> Select Files
                            </Button>
                            <input id="room-file-upload" type="file" className="sr-only" multiple accept="image/png, image/jpeg" onChange={handleFileChange} />
                        </label>
                        <div className="flex flex-wrap gap-2">
                             {selectedFiles.map((file, index) => (
                                <div key={index} className="file-preview">
                                    <span>{file.name}</span>
                                </div>
                             ))}
                        </div>
                     </div>
                      {/* Render the file preview list here (same logic as GuestFeedbackForm) */}
                     <div className="mt-2 flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-1 bg-neutral-light px-2 py-1 rounded text-xs text-neutral-darker border border-neutral">
                               <span className='truncate max-w-[100px]' title={file.name}>{file.name}</span> {/* Truncate long names */}
                                <button type="button" onClick={() => removeFile(file.name)} className="text-error hover:text-red-700 flex-shrink-0">
                                    <FaTimesCircle aria-label={`Remove ${file.name}`}/>
                                </button>
                             </div>
                        ))}
                    </div>
                </fieldset>

                <Button type="submit" isLoading={isLoading} disabled={isLoading} variant="primary" className="w-full mt-4" size="lg">
                    Submit Room Feedback
                </Button>
            </form>
        </Card>
    );
};
export default RoomFeedbackForm;

// Remember to include the StarRatingInputHelper component in this folder or import it.