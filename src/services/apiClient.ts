import axios from 'axios';

// Determine the base URL for the API
// In development, this will point to our local backend server.
// In production, this should point to the deployed backend URL.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We'll use an interceptor to dynamically add the Authorization header
// to requests if a token exists (e.g., in localStorage or a context).
// This prevents us from having to add it to every single API call manually.
apiClient.interceptors.request.use(
  (config) => {
    // This is where you would get the token from storage.
    // We will implement the AuthContext/storage part later.
    // For now, this is a placeholder for where the logic will go.
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Optional: Interceptor to handle responses, e.g., for global error handling like 401 redirects.
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response?.status === 401) {
      // Logic to handle unauthorized access.
      // For example, redirect to login page, clear token from storage.
      // This will be more robust once we have AuthContext.
      console.error('Unauthorized access - 401. Redirecting to login.');
      // In a real app, you'd do something like:
      // localStorage.removeItem('authToken');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);


export default apiClient;
