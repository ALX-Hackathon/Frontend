// src/components/dashboard/AdminDashboardWidgets.jsx
import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { FaRegComments, FaExclamationTriangle, FaStar, FaTag } from 'react-icons/fa';

const AdminDashboardWidgets = ({ feedbackData }) => {

    // Calculate stats using useMemo for efficiency
    const stats = useMemo(() => {
        const data = feedbackData || [];
        const totalEntries = data.length;
        const guestEntries = data.filter(f => f?.source === 'Guest'); // Added safe navigation
        const staffEntries = data.filter(f => f?.source === 'Staff');
        // Ensure isNegative exists before filtering
        const negativeEntries = data.filter(f => f?.isNegative === true).length;

        // Calculate average guest rating (only if rating exists and is valid)
        const guestRatings = guestEntries
            .map(f => f?.overallRating) // Use overallRating as the primary indicator
            .filter(r => typeof r === 'number' && r >= 1 && r <= 5);

        const averageRating = guestRatings.length > 0
            ? (guestRatings.reduce((sum, r) => sum + r, 0) / guestRatings.length).toFixed(1)
            : 'N/A';

        // Find most common staff log category
        let mostCommonCategory = 'N/A';
        if (staffEntries.length > 0) {
             const categoryCounts = staffEntries.reduce((acc, curr) => {
                // Ensure category exists before incrementing
                if(curr?.category) {
                    acc[curr.category] = (acc[curr.category] || 0) + 1;
                }
                 return acc;
             }, {});
            let maxCount = 0;
            for (const category in categoryCounts) {
                if (categoryCounts[category] > maxCount) {
                    maxCount = categoryCounts[category];
                    mostCommonCategory = category;
                }
            }
        }

        return { totalEntries, negativeEntries, averageRating, mostCommonCategory };

    }, [feedbackData]);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Total Feedback Widget */}
            <Card className="border border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3">
                    <FaRegComments className="text-blue-500 text-2xl flex-shrink-0" />
                    <div>
                         <h4 className="text-sm font-medium text-neutral-darker mb-1">Total Entries</h4>
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
                        <p className="text-xl font-bold text-neutral-darkest truncate" title={stats.mostCommonCategory}>{stats.mostCommonCategory}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboardWidgets;