// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useRef, useCallback, useState } from 'react';
import useApi from '../hooks/useApi';
import FeedbackList from '../components/dashboard/FeedbackList'; // Import the component containing the list and item logic
import RatingsPieChart from '../components/dashboard/RatingsPieChart';
import AdminDashboardWidgets from '../components/dashboard/AdminDashboardWidgets';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import { API_BASE_URL } from '../config/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { FaRegComments } from 'react-icons/fa'; // For 'No data' message
import Card from '../components/ui/Card';

const POLLING_INTERVAL = 15000; // Poll every 15 seconds

const AdminDashboardPage = () => {
    const {
        data: feedbackData,
        isLoading,
        error: apiError,
        request: fetchFeedbackApi,
        setError // get setError from hook to clear it manually
    } = useApi();

    const [isPolling, setIsPolling] = useState(true);
    const [isManualLoading, setIsManualLoading] = useState(false);
    const pollIntervalRef = useRef(null);

    // Memoized fetch function
    const fetchFeedback = useCallback(async (manual = false) => {
        if (!manual && isLoading) {
            // console.log("Fetch already in progress, skipping poll cycle.");
            return;
        }

        if (manual) setIsManualLoading(true);
        setError(null); // Clear previous errors on new fetch attempt

        const config = { method: 'get', url: `${API_BASE_URL}/feedback` };

        try {
            // console.log(manual ? "Manual fetch initiated..." : "Background fetch initiated...");
            const newData = await fetchFeedbackApi(config);
            // Feedback shown by hook on error, toast on manual success maybe
            if (manual && newData !== null) {
                toast.success("Dashboard refreshed!");
            }
        } catch (unexpectedError) {
            console.error("Unexpected error during fetchFeedback orchestration:", unexpectedError);
            setError("An unexpected client-side error occurred."); // Use hook's setError
            if (manual) toast.error("An unexpected error occurred during refresh.");
        } finally {
            if (manual) setIsManualLoading(false);
        }
    }, [fetchFeedbackApi, isLoading, setError]);

    // Effect for polling management
    useEffect(() => {
        fetchFeedback(true); // Initial fetch

        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;

        if (isPolling) {
            // console.log(`Dashboard: Starting polling every ${POLLING_INTERVAL / 1000}s`);
            pollIntervalRef.current = setInterval(() => {
                // console.log("Dashboard: Polling...");
                fetchFeedback(false); // Background fetch
            }, POLLING_INTERVAL);
        } else {
            // console.log("Dashboard: Polling stopped.");
        }

        // Cleanup interval on unmount or when polling stops
        return () => {
            if (pollIntervalRef.current) {
                // console.log("Dashboard: Clearing interval on cleanup.");
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
        };
    }, [isPolling, fetchFeedback]);

    // Determine when to show the main loading spinner
    const showLoadingIndicator = (isLoading && feedbackData === null) || isManualLoading;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral pb-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-neutral-darkest">
                    Admin Dashboard
                </h1>
                <div className='flex items-center justify-start sm:justify-end gap-2 flex-wrap'>
                    <Button
                        onClick={() => fetchFeedback(true)}
                        disabled={isManualLoading || (isLoading && !feedbackData)} // Prevent click if initial load ongoing
                        isLoading={isManualLoading}
                        size="sm"
                    >
                        Refresh Now
                    </Button>
                    <Button
                        onClick={() => setIsPolling(prev => !prev)}
                        variant={isPolling ? "warning" : "secondary"}
                        size="sm"
                    >
                        {isPolling ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {showLoadingIndicator && (
                <div className="flex justify-center items-center py-16">
                    <Spinner size="lg" color="primary" />
                </div>
            )}

            {/* API Error Alert */}
            {apiError && !showLoadingIndicator && (
                <Alert type="error" title="Dashboard Update Error" message={`Could not retrieve latest feedback data: ${apiError}. Data shown might be outdated. Auto-refresh may be interrupted.`} />
            )}

            {/* Main Content: Widgets, Charts, Feedback List */}
            {!showLoadingIndicator && feedbackData && feedbackData.length > 0 && (
                <>
                    {/* Statistics Widgets */}
                    <AdminDashboardWidgets feedbackData={feedbackData} />

                    {/* Visualization & Recent Feedback Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                        {/* Chart Column */}
                        <div className="lg:col-span-1">
                            <RatingsPieChart feedbackData={feedbackData} />
                        </div>

                        {/* Feedback List Column */}
                        <div className="lg:col-span-2">
                            <h2 className="text-lg md:text-xl font-semibold text-neutral-darker mb-4 lg:mt-0">
                                Recent Feedback Entries
                            </h2>
                            {/* Pass the valid feedbackData array to the list component */}
                            <FeedbackList feedbackData={feedbackData} />
                        </div>
                    </div>
                </>
            )}

            {/* No Data Message */}
            {!showLoadingIndicator && !apiError && (!feedbackData || feedbackData.length === 0) && (
                <Card>
                    <div className="text-center py-10 px-4">
                        <FaRegComments className="mx-auto text-4xl text-neutral mb-4" />
                        <p className="text-neutral-darker font-semibold mb-1">No feedback entries found.</p>
                        <p className="text-sm text-neutral-dark">As feedback comes in, it will appear here.</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AdminDashboardPage;