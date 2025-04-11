// src/components/dashboard/FeedbackList.jsx
import React from 'react';
import Card from '../ui/Card'; // Use the card for wrapping maybe, or just style list items
// import FeedbackListItem from './FeedbackListItem'; // Better: create a dedicated list item component
import { FaRegUserCircle, FaUserTie, FaStar, FaExclamationTriangle, FaThumbsUp, FaRegCommentDots } from 'react-icons/fa'; // Example icons

// Dedicated List Item Component (Recommended)
const FeedbackListItem = ({ feedback }) => {
  const { source, rating, severity, category, location, roomNumber, comment, details, language, timestamp, isNegative } = feedback;

  let bgColor = 'bg-white';
  let icon = source === 'Guest' ? <FaRegCommentDots className="text-blue-500" /> : <FaUserTie className="text-purple-600" />;
  let highlight = '';

  if (isNegative || rating <= 2 || severity === 'High') {
    bgColor = 'bg-red-50';
    highlight = 'border-l-4 border-error';
    icon = <FaExclamationTriangle className="text-error" />;
  } else if (severity === 'Medium') {
    bgColor = 'bg-yellow-50';
    highlight = 'border-l-4 border-warning';
  } else if (rating >= 4) {
    icon = <FaThumbsUp className="text-success" />;
  }

  const displayDetails = comment || details || 'No details provided.';
  const displayLocation = location || roomNumber || 'N/A';

  return (
    <div className={`p-4 rounded-md shadow-sm mb-3 border border-neutral ${bgColor} ${highlight}`}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
                 <span className="flex-shrink-0 w-5 h-5" title={source}>{icon}</span>
                <span className="font-semibold text-sm text-neutral-darkest">{source === 'Guest' ? 'Guest Feedback' : 'Staff Log'}</span>
                <span className="text-xs text-neutral-dark">({new Date(timestamp).toLocaleString()})</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
                {rating && (
                   <span className={`flex items-center font-bold ${rating <= 2 ? 'text-error' : rating >= 4 ? 'text-success' : 'text-neutral-darker'}`}>
                       <FaStar className="mr-1"/> {rating}
                    </span>
                )}
                 {severity && <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    severity === 'High' ? 'bg-red-100 text-error' :
                    severity === 'Medium' ? 'bg-yellow-100 text-warning' :
                    'bg-gray-100 text-neutral-darker'
                 }`}>{severity}</span>}
                {category && <span className="text-purple-700">{category}</span>}
                <span className="text-blue-600">Loc: {displayLocation}</span>
                {language && language === 'AMH' && <span className="text-xs text-neutral-dark">(Amharic)</span>}
            </div>
        </div>
         <p className="text-sm text-neutral-darker mt-1">{displayDetails}</p>
    </div>
  );
};


const FeedbackList = ({ feedbackData }) => {
  if (!feedbackData || feedbackData.length === 0) {
    return <p className="text-center text-neutral-dark mt-4">No feedback entries found.</p>;
  }

  return (
    <div className="space-y-3">
      {feedbackData.map((feedback) => (
        <FeedbackListItem key={feedback._id} feedback={feedback} /> // Assuming MongoDB uses _id
      ))}
    </div>
  );
};

export default FeedbackList;