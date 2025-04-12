// src/pages/ContextualFeedbackPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import useApi from "../Hooks/useApi"; // Assuming hook handles loading/errors well
import { API_BASE_URL } from "../config/api";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";

// Import DIFFERENT form components for each context
import CheckoutFeedbackForm from "../components/feedback/contextual/CheckoutFeedbackForm";
import RoomFeedbackForm from "../components/feedback/contextual/RoomFeedbackForm";
import DiningFeedbackForm from "../components/feedback/contextual/DiningFeedbackForm";
import PoolFeedbackForm from "../components/feedback/contextual/PoolFeedbackForm";
// import GenericLocationFeedbackForm from '../components/feedback/contextual/GenericLocationFeedbackForm';

// Mapping location codes to form components
const locationFormMap = {
  checkout: CheckoutFeedbackForm,
  room: RoomFeedbackForm,
  dining_table: DiningFeedbackForm,
  pool: PoolFeedbackForm,
  lobby: PoolFeedbackForm, // Example: Use Pool form for general amenity areas for now
  restroom_lobby: PoolFeedbackForm, // Or create a very simple restroom form
  // Add other mappings
};

// Define locations that require token validation
const locationsRequiringToken = ["checkout", "room"];

const ContextualFeedbackPage = () => {
  const [searchParams] = useSearchParams();
  const loc = searchParams.get("loc");
  const id = searchParams.get("id"); // Optional location ID (room number, table ID)
  const token = searchParams.get("tok"); // Session/Checkout Token
  const lang = searchParams.get("lang"); // Optional language

  const [isValidSession, setIsValidSession] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contextData, setContextData] = useState({}); // Store location, id, token, maybe guest name from validation

  const {
    request: validateTokenApi,
    error: apiErrorHook,
    isLoading: apiIsLoadingHook,
  } = useApi();

  useEffect(() => {
    const validateSession = async () => {
      setIsLoading(true);
      setValidationError(null);

      if (!loc) {
        setValidationError("Invalid feedback link: Location missing.");
        setIsLoading(false);
        return;
      }

      const requiresToken = locationsRequiringToken.includes(loc);

      if (requiresToken && !token) {
        setValidationError(
          `Invalid feedback link: Token required for '${loc}' location.`
        );
        setIsLoading(false);
        return;
      }

      // If token is required, validate it
      if (requiresToken && token) {
        console.log(`Validating token for loc='${loc}', tok='${token}'...`);
        const config = {
          method: "get", // Assuming GET endpoint
          url: `${API_BASE_URL}/feedback/validate-token?tok=${token}&loc=${loc}${
            id ? `&id=${id}` : ""
          }`, // Pass context to backend
        };
        const validationResponse = await validateTokenApi(config);

        // Backend should return success status and maybe guest context (name?) if valid
        // e.g., { valid: true, context: { guestName: "Mr. Smith" } }
        if (validationResponse?.valid) {
          console.log("Token valid:", validationResponse);
          setContextData({
            loc,
            id,
            token,
            ...(validationResponse.context || {}),
          });
          setIsValidSession(true);
        } else {
          // Handle specific errors from backend if available, otherwise use hook error or generic
          const errMsg =
            validationResponse?.message ||
            apiErrorHook ||
            "Invalid or expired feedback session token.";
          setValidationError(errMsg);
          setIsValidSession(false);
        }
      } else {
        // Public location or no token required, proceed directly
        console.log(
          `Public location '${loc}', proceeding without token validation.`
        );
        setContextData({ loc, id }); // Pass context without token
        setIsValidSession(true);
      }

      setIsLoading(false);
    };

    validateSession();
    // Rerun validation only if search params change (prevents re-validation on internal state change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, validateTokenApi]); // Do NOT add apiErrorHook or other states here to avoid loops

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-light p-4">
        <Spinner size="lg" />
        <p className="mt-4 text-neutral-dark">Verifying feedback session...</p>
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-light p-4 text-center">
        <Alert type="error" title="Invalid Link" message={validationError} />
        <p className="mt-4 text-sm text-neutral-dark">
          Please ensure you scanned the correct QR code. If the problem
          persists, contact reception.
        </p>
        {/* Optionally add a button to go back to the main site */}
        {/* <Link to="/"><Button variant="outline" className="mt-6">Go to Homepage</Button></Link> */}
      </div>
    );
  }

  if (isValidSession) {
    // Find the correct form component based on the 'loc' parameter
    const FeedbackFormComponent = locationFormMap[loc];

    if (FeedbackFormComponent) {
      // Render the specific form, passing down the context
      return (
        // Basic wrapper to center form on page (adjust styling as needed)
        <div className="min-h-screen bg-neutral-light py-8 px-4 flex items-center justify-center">
          <div className="w-full max-w-xl">
            <FeedbackFormComponent context={contextData} />
          </div>
        </div>
      );
    } else {
      // Fallback if location code is unrecognized but passed initial checks
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-light p-4 text-center">
          <Alert
            type="error"
            title="Error"
            message={`Unsupported feedback location code: ${loc}.`}
          />
        </div>
      );
    }
  }

  // Fallback if session is somehow not valid and no error/loading state applies
  return <Navigate to="/" />; // Or show a generic error
};

export default ContextualFeedbackPage;
