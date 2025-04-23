// src/components/dashboard/FeedbackList.jsx
import React from 'react';
import { FaRegCommentDots, FaUserTie, FaExclamationTriangle, FaCamera, FaStar } from 'react-icons/fa'; // Consolidated imports

// Parent List Component
const FeedbackList = ({ feedbackData }) => {
    // Defensive check for data validity
    if (!feedbackData || !Array.isArray(feedbackData)) {
        // Could show a loading or error skeleton, but AdminDashboardPage handles main states
        // Log if needed: console.warn("FeedbackList received invalid data:", feedbackData);
        return <div className="text-center text-neutral-dark mt-4 py-6">Waiting for feedback data...</div>; // Or return null
    }

    if (feedbackData.length === 0) {
         return <p className="text-center text-neutral-dark mt-4 py-6">No feedback entries found.</p>;
    }

    // Optional Log: See the raw data received by the list component
    // console.log("FeedbackList rendering with data:", feedbackData);

    return (
        <div className="space-y-3">
            {feedbackData.map((feedbackItem, index) => {
                // ** CRUCIAL FIX: Validate each item before rendering **
                if (!feedbackItem || typeof feedbackItem !== 'object') {
                    console.error(`FeedbackList: Skipping invalid item at index ${index}:`, feedbackItem);
                    return null; // Don't render invalid items
                }

                // Generate a stable and unique key
                const key = feedbackItem._id || `feedback-${index}-${feedbackItem.timestamp || Date.now()}`;

                return <FeedbackListItem key={key} feedback={feedbackItem} />;
            })}
        </div>
    );
};

// Child Item Component (Displays a single feedback entry)
const FeedbackListItem = ({ feedback }) => {
    // ** DEFENSIVE CHECK **: Though parent validates, an extra check is safe
    if (!feedback) {
        console.error("FeedbackListItem received undefined feedback prop!");
        return (
            <div className="p-4 mb-3 border border-error bg-error-light text-error-dark rounded">
                Error: Invalid feedback data received.
            </div>
        );
    }

    // Destructure ALL expected properties (including potentially missing ones)
    const {
        source = 'Unknown', // Provide defaults
        timestamp,
        isNegative = false,
        language,
        feedbackArea, contextLoc, contextId, contextToken, // Context fields might be missing on older data
        overallRating = 0, feedbackType,          // General guest fields
        checkoutSpeed = 0, checkoutStaffFriendliness = 0, billingAccuracy = 0, checkoutComments, // Checkout fields
        roomCleanliness = 0, roomComfort = 0, roomNoise = 0, roomComments, // Room fields
        bathroomCleanliness = 0, roomAmenities = 0,
        foodQuality = 0, serviceSpeed = 0, staffAttentiveness = 0, ambianceRating = 0, diningService = 0, diningComments, wifiRating = 0, // Dining & specific amenities
        poolCleanliness = 0, seatingAvailability = 0, towelAvailability = 0, poolAmbiance = 0, amenityComments,      // Amenity fields
        restroomRating = 0,
        staffHelpfulness = 0, staffFriendliness = 0, receptionRating = 0, staffComments, // Staff fields
        staffMention,
        category, severity, details, location, // Staff Log fields
        valueRating = 0,
        comment, // Handle potential legacy field
        otherComments, // Added this explicitly
        simulatedFileNames = [],
        ...rest // Capture any unexpected fields
    } = feedback;


    // --- Determine Visual Styles ---
    let bgColor = 'bg-white';
    let icon = source === 'Staff' ? <FaUserTie className="text-purple-600" /> : <FaRegCommentDots className="text-blue-500" />;
    let highlight = 'border-l-4 border-transparent';

    if (isNegative) {
        bgColor = 'bg-error-light';
        highlight = 'border-l-4 border-error';
        icon = <FaExclamationTriangle className="text-error" />;
    } else if (feedbackType === 'compliment' || overallRating >= 4) { // Check feedbackType too
        bgColor = 'bg-success-light';
        highlight = 'border-l-4 border-success';
    } else if (severity === 'Medium') {
        bgColor = 'bg-warning-light';
        highlight = 'border-l-4 border-warning';
    } else if (severity === 'Low') {
        bgColor = 'bg-neutral-lightest'; // Slightly different bg for low severity staff logs
    }

    // --- Prepare Display Text ---
    const displayArea = feedbackArea || contextLoc || category || 'General';
    const displayIdentifier = contextId || location || '';

    // Consolidate all comment fields into one display string
    const allComments = [
        comment, checkoutComments, roomComments, diningComments, amenityComments, staffComments, details, otherComments
    ].filter(comment => comment && typeof comment === 'string' && comment.trim() !== '').join('; '); // Filter better

    const formattedTime = timestamp ? new Date(timestamp).toLocaleString() : 'Time Unknown';

    // Function to render a rating only if it's a valid number > 0
    const renderRating = (label, value) => {
        if (value && typeof value === 'number' && value > 0) {
            return <RatingDisplay label={label} value={value} />;
        }
        return null;
    };

    return (
        <div className={`p-4 rounded-md shadow-sm mb-3 border border-neutral ${bgColor} ${highlight} transition-shadow hover:shadow-md`}>
            {/* Top Row: Meta Info */}
            <div className="flex items-center justify-between mb-2 flex-wrap gap-x-4 gap-y-1">
                {/* Left Side */}
                <div className="flex items-center space-x-2 flex-wrap">
                    <span className="flex-shrink-0 w-5 h-5" title={source}>{icon}</span>
                    <span className="font-semibold text-sm text-neutral-darkest">{source} - {displayArea}</span>
                    {displayIdentifier && <span className="text-xs text-blue-600 font-mono break-all">({displayIdentifier})</span>}
                    <span className="text-xs text-neutral-dark hidden sm:inline">| {formattedTime}</span>
                </div>
                {/* Right Side: Ratings & Badges */}
                <div className="flex items-center space-x-3 text-sm flex-wrap gap-y-1">
                    {renderRating("Overall", overallRating)}
                    {renderRating("Checkout", checkoutSpeed)}
                    {renderRating("Room Clean", roomCleanliness)}
                    {renderRating("Bathroom", bathroomCleanliness)}
                    {renderRating("Comfort", roomComfort)}
                    {renderRating("Food", foodQuality)}
                    {renderRating("Dining Svc", diningService)}
                    {renderRating("Pool Clean", poolCleanliness)}
                    {renderRating("WiFi", wifiRating)}
                    {renderRating("Staff Help", staffHelpfulness)}
                    {/* Add other specific ratings using renderRating */}

                    {severity && <SeverityBadge severity={severity} />}
                    {feedbackType && <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">{feedbackType}</span>}
                    {language === 'AMH' && <span className="text-xs text-neutral-dark">(Amh)</span>}
                    <span className="text-xs text-neutral-dark inline sm:hidden">({formattedTime})</span>
                </div>
            </div>
            {/* Comments/Details Section */}
            {allComments ? (
                 <p className="text-sm text-neutral-darker mt-1 whitespace-pre-wrap break-words">{allComments}</p>
             ) : (
                <p className="text-sm text-neutral-dark mt-1 italic">No specific comments provided.</p>
             )}
            {/* Staff Mention */}
            {staffMention && (
                 <p className="mt-1 text-xs text-purple-700">Mentioned Staff: <span className="font-medium">{staffMention}</span></p>
            )}
             {/* Attached Files */}
             {simulatedFileNames && simulatedFileNames.length > 0 && (
                <div className="mt-2 text-xs text-neutral-dark flex items-center gap-1 flex-wrap">
                    <FaCamera className="flex-shrink-0"/> Attached: {simulatedFileNames.join(', ')}
                 </div>
            )}
        </div>
    );
};


// --- Helper Components ---
const RatingDisplay = ({ label, value }) => (
   <span className={`whitespace-nowrap flex items-center text-xs font-medium ${value <= 2 ? 'text-error' : value >= 4 ? 'text-success' : 'text-neutral-dark'}`}>
        {label && <span className="mr-1 opacity-80">{label}:</span>}
       <span className='font-bold'>{value}★</span>
     </span>
);

 const SeverityBadge = ({ severity }) => (
     <span className={`whitespace-nowrap px-2 py-0.5 rounded-full text-xs font-medium ${
          severity === 'High' ? 'bg-error-light text-error-dark border border-error' :
          severity === 'Medium' ? 'bg-warning-light text-warning-dark border border-warning' :
          'bg-gray-100 text-gray-700 border border-neutral-light'
     }`}>
         {severity}
    </span>
 );

export default FeedbackList; // Export the main list component