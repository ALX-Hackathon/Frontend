// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useRef, useCallback, useState } from 'react';
import useApi from '../hooks/useApi';
import FeedbackList from '../components/dashboard/FeedbackList'; // Displays the list of feedback items
import RatingsPieChart from '../components/dashboard/RatingsPieChart'; // The pie chart component
import AdminDashboardWidgets from '../components/dashboard/AdminDashboardWidgets'; // Component for summary stats widgets
import Spinner from '../components/ui/Spinner'; // Loading indicator
import Alert from '../components/ui/Alert'; // Component for showing errors/alerts
import { API_BASE_URL } from '../config/api'; // Base URL for API calls
import Button from '../components/ui/Button'; // Custom button component
import Card from '../components/ui/Card'; // Custom card component for layout
import { FaRegComments } from 'react-icons/fa'; // Example icon for empty state
import toast from 'react-hot-toast'; // For toast notifications

const POLLING_INTERVAL = 15000; // Poll for new data every 15 seconds

const AdminDashboardPage = () => {
  // useApi Hook setup
  const {
    data: feedbackData,   // Holds the fetched feedback list
    isLoading,            // Tracks if any fetch is currently in progress via the hook
    error: apiError,      // Holds any error message from the last API request
    request: fetchFeedbackApi, // The function from the hook to make API calls
    setData,              // Function to manually set data (if needed, though hook does it)
    setError              // Function to manually set error state
  } = useApi();

  const [isPolling, setIsPolling] = useState(true); // State to control whether polling is active
  const [isManualLoading, setIsManualLoading] = useState(false); // State for manual refresh button's loading indicator
  const pollIntervalRef = useRef(null); // Stores the interval ID for cleanup

  // Memoized function to fetch feedback data
  const fetchFeedback = useCallback(async (manual = false) => {
    // Prevent overlapping requests if a fetch (especially background poll) is already running
    if (!manual && isLoading) {
      console.log("Fetch already in progress, skipping poll cycle.");
      return;
    }

    if (manual) setIsManualLoading(true); // Show loading spinner on manual refresh button
    setError(null); // Clear previous API errors before a new attempt

    const config = { method: 'get', url: `${API_BASE_URL}/feedback` };

    try {
      console.log(manual ? "Manual fetch initiated..." : "Background fetch initiated...");
      // Call the API hook. It handles setting data, loading, and errors internally.
      // The returned value (newData) can be used for immediate checks if necessary.
      const newData = await fetchFeedbackApi(config);

      if (newData === null && apiError) {
        // Optional: Add specific logging or handling if fetch returned null due to error
        console.warn("API fetch returned null, error likely set by useApi:", apiError);
        if(manual) {
             toast.error(`Failed to refresh: ${apiError}`); // Give toast feedback on manual failure
        }
        // Stop polling if there's a persistent error? Maybe not automatically.
        // setIsPolling(false);
      } else if (manual && newData !== null){
         toast.success("Dashboard refreshed!");
      }

    } catch(unexpectedError) {
       // This catch block is mostly for unexpected errors *outside* the axios call itself
       console.error("Unexpected error during fetchFeedback orchestration:", unexpectedError);
       setError("An unexpected client-side error occurred."); // Update error state
        if(manual) toast.error("An unexpected error occurred during refresh.");
    } finally {
      if (manual) setIsManualLoading(false); // Stop manual loading indicator
    }
  }, [fetchFeedbackApi, isLoading, setError, apiError]); // Include apiError in deps? Be cautious of loops


  // Effect to manage the polling interval
  useEffect(() => {
    // Fetch data immediately when the component mounts
    fetchFeedback(true); // Pass true for manual to potentially show initial loader clearly

    // Clear any previous interval if settings change (e.g., isPolling toggled)
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null; // Clear the ref
    }

    // Start polling if enabled
    if (isPolling) {
      console.log(`Dashboard: Starting polling every ${POLLING_INTERVAL / 1000}s`);
      pollIntervalRef.current = setInterval(() => {
        console.log("Dashboard: Polling...");
        fetchFeedback(false); // Fetch in the background
      }, POLLING_INTERVAL);
    } else {
      console.log("Dashboard: Polling stopped.");
    }

    // Cleanup function: Essential to clear the interval when the component unmounts
    // or before the effect re-runs due to dependency changes.
    return () => {
      if (pollIntervalRef.current) {
        console.log("Dashboard: Clearing interval on cleanup.");
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isPolling, fetchFeedback]); // Effect dependencies


  // Determine when to show the main loading indicator (initial load or manual refresh)
  const showLoadingIndicator = (isLoading && feedbackData === null) || isManualLoading;

  return (
    // Increased vertical spacing between elements using space-y-*
    <div className="space-y-8 md:space-y-10">
      {/* Header section with Title and Action Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-neutral pb-4">
        <h1 className="text-xl md:text-2xl font-semibold text-neutral-darkest">Admin Dashboard</h1>
        <div className='flex items-center gap-2 flex-wrap'>
          {/* Manual Refresh Button */}
          <Button
            onClick={() => fetchFeedback(true)} // Trigger manual fetch
            disabled={isManualLoading || (isLoading && !feedbackData)} // Disable if loading
            isLoading={isManualLoading} // Show spinner inside button
            size="sm" // Slightly smaller buttons maybe
          >
            Refresh Now
          </Button>
          {/* Toggle Polling Button */}
          <Button
            onClick={() => setIsPolling(prev => !prev)} // Toggle polling state
            variant={isPolling ? "warning" : "secondary"} // Use warning color for "Stop" state
            size="sm"
          >
            {isPolling ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
          </Button>
        </div>
      </div>

      {/* Main Loading Indicator: Only shown during initial load or manual refresh */}
      {showLoadingIndicator && (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" color="primary" />
        </div>
      )}

      {/* API Error Alert: Shown persistently if an API error occurred */}
      {apiError && !showLoadingIndicator && (
         // Make error more prominent maybe
        <Alert type="error" title="Dashboard Update Error" message={`Could not retrieve latest feedback data: ${apiError}. Data shown might be outdated. Auto-refresh may be interrupted.`} />
      )}

      {/* Content Area: Rendered when not doing initial/manual load */}
      {/* Show content even if polling fails (error is displayed above) */}
      {!showLoadingIndicator && feedbackData && (
        <>
          {/* Widgets Section */}
          <AdminDashboardWidgets feedbackData={feedbackData} />

          {/* Visualization & Recent Feedback Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Chart occupies 1 column on large screens */}
            <div className="lg:col-span-1">
              {/* Card component provides padding/background */}
               <RatingsPieChart feedbackData={feedbackData} />
            </div>

             {/* Feedback list occupies remaining columns on large screens */}
             <div className="lg:col-span-2">
                <h2 className="text-lg md:text-xl font-semibold text-neutral-darker mb-4">Recent Feedback Entries</h2>
               <FeedbackList feedbackData={feedbackData} />
             </div>
           </div>
         </>
       )}

       {/* No Data Message: Shown only if not loading, no errors, and feedbackData is empty/null */}
      {!showLoadingIndicator && !apiError && (!feedbackData || feedbackData.length === 0) && (
        <Card>
            <div className="text-center py-10">
                <FaRegComments className="mx-auto text-4xl text-neutral mb-4" /> {/* Example Icon */}
                <p className="text-neutral-dark font-semibold">No feedback entries yet.</p>
                 <p className="text-sm text-neutral-dark">As feedback comes in, it will appear here.</p>
            </div>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboardPage;