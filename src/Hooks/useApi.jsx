// src/hooks/useApi.jsx
import { useState, useCallback } from 'react';
import axios from 'axios';

// Configure global Axios instance (optional but good practice)
// axios.defaults.baseURL = API_BASE_URL;
// Could add interceptors here later for auth headers etc.

const useApi = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // `requestConfig`: { method: 'get'|'post'|..., url: string, data?: object, params?: object }
  const request = useCallback(async (requestConfig, successCallback = null, errorCallback = null) => {
    setIsLoading(true);
    setError(null);
    setData(null); // Reset data on new request

    try {
      const response = await axios({ // Use lowercase method
        ...requestConfig,
        url: requestConfig.url // Base URL will be prefixed if defaults are set
      });
      setData(response.data);
      if (successCallback) {
        successCallback(response.data);
      }
      return response.data; // Return data for direct use
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unknown API error occurred.';
      console.error('API Error:', err);
      setError(errorMessage);
       if (errorCallback) {
        errorCallback(errorMessage);
      }
      return null; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies, `axios` instance is stable

  return { data, isLoading, error, request, setError }; // Allow manually setting error
};

export default useApi;