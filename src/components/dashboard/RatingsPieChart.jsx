
// src/components/dashboard/RatingsPieChart.jsx
import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import Card from '../ui/Card'; // Wrap chart in a Card

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const RatingsPieChart = ({ feedbackData }) => {
  // Calculate rating counts using useMemo to avoid recalculation on every render
  const ratingCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (!feedbackData) return counts;

    feedbackData.forEach(item => {
      if (item.source === 'Guest' && item.rating >= 1 && item.rating <= 5) {
        counts[item.rating]++;
      }
    });
    return counts;
  }, [feedbackData]); // Recalculate only when feedbackData changes

  const data = {
    labels: ['1 Star ★', '2 Stars ★★', '3 Stars ★★★', '4 Stars ★★★★', '5 Stars ★★★★★'],
    datasets: [
      {
        label: '# of Votes',
        data: Object.values(ratingCounts), // Get counts in order [1, 2, 3, 4, 5]
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)', // Red (Tailwind red-500)
          'rgba(245, 158, 11, 0.7)', // Amber (Tailwind amber-500)
          'rgba(234, 179, 8, 0.7)',  // Yellow (Tailwind yellow-500)
          'rgba(132, 204, 22, 0.7)', // Lime (Tailwind lime-500) - adjusted shade
          'rgba(34, 197, 94, 0.7)',  // Green (Tailwind green-500)
        ],
        borderColor: [ // Optional borders
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Position legend
      },
      title: {
        display: true,
        text: 'Guest Rating Distribution', // Chart title
         font: {
            size: 16
         },
         padding: {
             bottom: 20 // Add padding below title
          }
      },
      tooltip: {
        callbacks: {
            label: function(context) {
               let label = context.dataset.label || '';
                if (label) {
                   label += ': ';
                }
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

  const totalRatings = Object.values(ratingCounts).reduce((sum, count) => sum + count, 0);

  return (
    <Card title="Rating Analysis">
       {totalRatings > 0 ? (
         <Pie options={options} data={data} />
       ) : (
          <p className='text-center text-neutral-dark py-10'>No guest ratings available to display.</p>
        )}
    </Card>
  );
};

export default RatingsPieChart;

