// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useRef, useCallback, useState } from "react";
import useApi from "../Hooks/useApi";
import FeedbackList from "../components/dashboard/FeedbackList"; // Import the component containing the list and item logic
import RatingsPieChart from "../components/dashboard/RatingsPieChart";
import AdminDashboardWidgets from "../components/dashboard/AdminDashboardWidgets";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { API_BASE_URL } from "../config/api";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import { FaRegComments } from "react-icons/fa"; // For 'No data' message
import Card from "../components/ui/Card";

const POLLING_INTERVAL = 15000; // Poll every 15 seconds

const AdminDashboardPage = () => {
  const {
    data: feedbackData,
    isLoading,
    error: apiError,
    request: fetchFeedbackApi,
    setError, // get setError from hook to clear it manually
  } = useApi();

  const [isPolling, setIsPolling] = useState(true);
  const [isManualLoading, setIsManualLoading] = useState(false);
  const pollIntervalRef = useRef(null);
  const lastFetchTimeRef = useRef(null);

  // Optimized fetch function with debouncing and state management
  const fetchFeedback = useCallback(
    async (manual = false) => {
      // Prevent concurrent fetches unless manual
      if (!manual && (isLoading || isManualLoading)) {
        return;
      }

      // Debounce rapid manual refreshes
      const now = Date.now();
      if (
        manual &&
        lastFetchTimeRef.current &&
        now - lastFetchTimeRef.current < 2000
      ) {
        toast.error("Please wait a moment before refreshing again");
        return;
      }

      if (manual) {
        setIsManualLoading(true);
        lastFetchTimeRef.current = now;
      }

      setError(null);

      try {
        const newData = await fetchFeedbackApi({
          method: "get",
          url: `${API_BASE_URL}/feedback`,
        });

        if (manual && newData !== null) {
          toast.success("Dashboard refreshed!");
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("An unexpected error occurred while fetching data.");
        if (manual) {
          toast.error("Failed to refresh dashboard");
        }
      } finally {
        if (manual) {
          setIsManualLoading(false);
        }
      }
    },
    [fetchFeedbackApi, isLoading, isManualLoading, setError]
  );

  // Optimized polling effect
  useEffect(() => {
    // Initial fetch
    fetchFeedback(true);

    // Setup polling
    if (isPolling) {
      pollIntervalRef.current = setInterval(() => {
        fetchFeedback(false);
      }, POLLING_INTERVAL);
    }

    // Cleanup
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isPolling, fetchFeedback]);

  // Memoized refresh handler
  const handleManualRefresh = useCallback(() => {
    fetchFeedback(true);
  }, [fetchFeedback]);

  // Memoized polling toggle handler
  const handlePollingToggle = useCallback(() => {
    setIsPolling((prev) => !prev);
  }, []);

  // Determine when to show the main loading spinner
  const showLoadingIndicator =
    (isLoading && feedbackData === null) || isManualLoading;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral pb-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-neutral-darkest">
          Admin Dashboard
        </h1>
        <div className="flex items-center justify-start sm:justify-end gap-2 flex-wrap">
          <Button
            onClick={handleManualRefresh}
            disabled={isManualLoading || (isLoading && !feedbackData)}
            isLoading={isManualLoading}
            size="sm"
          >
            Refresh Now
          </Button>
          <Button
            onClick={handlePollingToggle}
            variant={isPolling ? "warning" : "secondary"}
            size="sm"
          >
            {isPolling ? "Stop Auto-Refresh" : "Start Auto-Refresh"}
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
        <Alert
          type="error"
          title="Dashboard Update Error"
          message={`Could not retrieve latest feedback data: ${apiError}. Data shown might be outdated. Auto-refresh may be interrupted.`}
        />
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
      {!showLoadingIndicator &&
        !apiError &&
        (!feedbackData || feedbackData.length === 0) && (
          <Card>
            <div className="text-center py-10 px-4">
              <FaRegComments className="mx-auto text-4xl text-neutral mb-4" />
              <p className="text-neutral-darker font-semibold mb-1">
                No feedback entries found.
              </p>
              <p className="text-sm text-neutral-dark">
                As feedback comes in, it will appear here.
              </p>
            </div>
          </Card>
        )}
    </div>
  );
};

export default AdminDashboardPage;
