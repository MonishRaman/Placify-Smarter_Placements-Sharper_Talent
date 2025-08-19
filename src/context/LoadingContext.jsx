import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

// Create a context for managing loading state
export const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
});

// Custom hook to access the loading context
export const useLoading = () => useContext(LoadingContext);

// Provider component to wrap the application
export const LoadingProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  // Setup interceptors when the component mounts
  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        // Increment the counter when a request starts
        setPendingRequests((prev) => prev + 1);
        return config;
      },
      (error) => {
        // Decrement on request error
        setPendingRequests((prev) => Math.max(0, prev - 1));
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => {
        // Decrement the counter when a response is received
        setPendingRequests((prev) => Math.max(0, prev - 1));
        return response;
      },
      (error) => {
        // Decrement on response error
        setPendingRequests((prev) => Math.max(0, prev - 1));
        return Promise.reject(error);
      }
    );

    // Clean up the interceptors when the component unmounts
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Update loading state whenever pendingRequests changes
  useEffect(() => {
    setLoading(pendingRequests > 0);
  }, [pendingRequests]);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};
