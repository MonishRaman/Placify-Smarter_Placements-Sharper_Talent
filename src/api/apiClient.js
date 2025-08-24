import axios from 'axios';

// Determine if we're in development mode
const isDev = import.meta.env.MODE === 'development' || !import.meta.env.PROD;

// Create a new instance of axios with a custom configuration
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For debugging in development only
if (isDev) {
  apiClient.interceptors.request.use(request => {
    console.log('🚀 Request:', request.method?.toUpperCase(), request.url);
    return request;
  });
}

// --- Request Interceptor for Authentication ---
// This will automatically add the auth token to every request if it exists
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists and Authorization header isn't already set by the request
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Global Error Handling Interceptor ---
// This function will run for every response that has an error (like a 404 or 500)
apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // If there's an error, we can handle it here globally
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
      
      // Handle authentication errors - redirect to login page
      if (error.response.status === 401) {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page (if not already there)
        if (!window.location.pathname.includes('/auth')) {
          console.warn('Session expired. Redirecting to login...');
          window.location.href = '/auth';
          
          // Show error only if not redirecting
          return Promise.reject(error);
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      errorMessage = 'Could not connect to the server. Please check your connection and try again.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      errorMessage = error.message;
    }

    // Here you could trigger a global notification/toast using a toast library
    // For now, we'll just log to console and let the component handle it
    console.error(`API Error: ${errorMessage}`);

    // Reject the promise so the component's .catch() block can also handle it if needed
    return Promise.reject(error);
  }
);

export default apiClient;