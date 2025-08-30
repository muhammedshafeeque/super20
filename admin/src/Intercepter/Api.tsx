import axios from 'axios';
import { BaseURL, LOCAL_STORAGE_KEY } from '../Constants/Constants';
// Create instance
const axiosInstance = axios.create({
  baseURL: BaseURL,   // change to your API base
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.AUTH_TOKEN); // or use cookies, context, etc.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Optionally modify the response
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Handle unauthorized, e.g., redirect to login
        console.warn('Unauthorized access - maybe redirect to login.');
      } else if (status >= 500) {
        console.error('Server error:', status);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
