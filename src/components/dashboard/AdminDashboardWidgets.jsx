// src/components/dashboard/AdminDashboardWidgets.jsx
import React, { useMemo } from 'react';
import Card from '../ui/Card'; // Assuming Card component exists
import { FaRegComments, FaExclamationTriangle, FaStar, FaTag } from 'react-icons/fa'; // Example icons

const AdminDashboardWidgets = ({ feedbackData }) => {

    // Calculate stats using useMemo
    const stats = useMemo(() => {
        const data = feedbackData || []; // Handle null/undefined input
        const totalEntries = data.length;
        const guestEntries = data.filter(f => f.source === 'Guest');
        const staffEntries = data.filter(f => f.source === 'Staff');
        const negativeEntries = data.filter(f => f.isNegative).length;

        // Calculate average guest rating
        const guestRatings = guestEntries.map(f => f.rating).filter(r => r >= 1 && r <= 5);
        const averageRating = guestRatings.length > 0
            ? (guestRatings.reduce((sum, r) => sum + r, 0) / guestRatings.length).toFixed(1)
            : 'N/A';

        // Find most common staff log category (simple version)
        let mostCommonCategory = 'N/A';
        if (staffEntries.length > 0) {
             const categoryCounts = staffEntries.reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + 1;
                 return acc;
             }, {});
            // Find the category with the max count
            let maxCount = 0;
            for (const category in categoryCounts) {
                if (categoryCounts[category] > maxCount) {
                    maxCount = categoryCounts[category];
                    mostCommonCategory = category;
                }
            }
        }


        return {
            totalEntries,
            negativeEntries,
            averageRating,
            mostCommonCategory
        };

    }, [feedbackData]); // Dependency: recalculate only if feedbackData changes


    return (
         // Responsive grid layout
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

             {/* Total Feedback Widget */}
            <Card className="border border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3">
                    <FaRegComments className="text-blue-500 text-2xl flex-shrink-0" />
                    <div>
                         <h4 className="text-sm font-medium text-neutral-darker mb-1">Total Feedback</h4>
                         <p className="text-2xl font-bold text-neutral-darkest">{stats.totalEntries}</p>
                     </div>
                 </div>
             </Card>

            {/* Negative Alerts Widget */}
             <Card className="border border-red-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3">
                     <FaExclamationTriangle className="text-error text-2xl flex-shrink-0" />
                     <div>
                        <h4 className="text-sm font-medium text-neutral-darker mb-1">Negative Alerts</h4>
                        <p className="text-2xl font-bold text-error">{stats.negativeEntries}</p>
                    </div>
                </div>
             </Card>

             {/* Average Guest Rating Widget */}
            <Card className="border border-yellow-200 hover:shadow-lg transition-shadow">
                 <div className="flex items-center space-x-3">
                     <FaStar className="text-yellow-500 text-2xl flex-shrink-0" />
                     <div>
                         <h4 className="text-sm font-medium text-neutral-darker mb-1">Avg. Guest Rating</h4>
                         <p className="text-2xl font-bold text-neutral-darkest">{stats.averageRating}</p>
                     </div>
                </div>
             </Card>

             {/* Most Common Staff Category Widget */}
             <Card className="border border-purple-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-3">
                     <FaTag className="text-purple-500 text-2xl flex-shrink-0" />
                      <div>
                         <h4 className="text-sm font-medium text-neutral-darker mb-1">Top Staff Category</h4>
                         <p className="text-xl font-bold text-neutral-darkest truncate" title={stats.mostCommonCategory}>{stats.mostCommonCategory}</p> {/* Truncate long names */}
                     </div>
                 </div>
             </Card>

        </div>
    );
};

export default AdminDashboardWidgets;