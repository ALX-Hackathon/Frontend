// src/components/dashboard/RatingsPieChart.jsx
import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { FaStar } from 'react-icons/fa'; // Importing star icon for empty state
import Card from '../ui/Card';

ChartJS.register(ArcElement, Tooltip, Legend, Title); // Register ChartJS components

const RatingsPieChart = ({ feedbackData }) => {
    // Calculate rating counts using useMemo to optimize performance
    const ratingCounts = useMemo(() => {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (!feedbackData || !Array.isArray(feedbackData)) {
             return counts; // Return default if data is invalid
        }

        feedbackData.forEach(item => {
            // Ensure item and relevant properties exist and are valid
            if (item?.source === 'Guest' && typeof item.overallRating === 'number' && item.overallRating >= 1 && item.overallRating <= 5) {
                counts[item.overallRating]++;
            }
        });
        return counts;
    }, [feedbackData]); // Recalculate only when feedbackData changes

    const chartData = {
        labels: ['1 Star ★', '2 Stars ★★', '3 Stars ★★★', '4 Stars ★★★★', '5 Stars ★★★★★'],
        datasets: [
            {
                label: '# of Ratings',
                data: Object.values(ratingCounts), // Get counts [count1, count2, ...]
                 // Define appealing and accessible colors
                 backgroundColor: [
                     'rgba(239, 68, 68, 0.7)',  // Red-500
                     'rgba(245, 158, 11, 0.7)', // Amber-500
                    'rgba(234, 179, 8, 0.7)',  // Yellow-500
                    'rgba(132, 204, 22, 0.7)', // Lime-500
                     'rgba(34, 197, 94, 0.7)',  // Green-500
                 ],
                 borderColor: [ // Subtle borders
                     'rgba(239, 68, 68, 1)',
                     'rgba(245, 158, 11, 1)',
                    'rgba(234, 179, 8, 1)',
                     'rgba(132, 204, 22, 1)',
                     'rgba(34, 197, 94, 1)',
                 ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true, // Keep aspect ratio
         plugins: {
             legend: {
                position: 'bottom', // Position legend below chart
                labels: { padding: 20 } // Add padding to legend items
             },
            title: {
                 display: true,
                text: 'Overall Guest Rating Distribution',
                font: { size: 16, weight: '600' }, // Slightly larger title
                padding: { bottom: 20 },
                color: '#1f2937' // neutral-darkest
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                       // Display count and percentage in tooltip
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                         if (context.parsed !== null) {
                           label += context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) + '%' : '0%';
                             label += ` (${percentage})`;
                        }
                        return label;
                    }
                 }
            }
         },
     };

     // Check if there's any data to display
     const totalRatings = Object.values(ratingCounts).reduce((sum, count) => sum + count, 0);

    return (
         // Wrap the chart in the Card component for consistent styling
         <Card title="Rating Analysis">
            {totalRatings > 0 ? (
                // Use a wrapper div to help with responsiveness if needed
                <div style={{ position: 'relative', height: '300px', width: '100%' }}> {/* Adjust height */}
                   <Pie options={chartOptions} data={chartData} />
                 </div>
             ) : (
                 <div className="text-center text-neutral-dark py-10">
                    <FaStar className="mx-auto text-3xl text-neutral mb-3" />
                    <p>No overall guest ratings available to display chart.</p>
                 </div>
             )}
         </Card>
     );
};

export default RatingsPieChart;