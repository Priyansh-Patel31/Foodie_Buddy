import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.mock-foodie.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor for Authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for Responses
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle global errors here (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/'; // Or trigger a Redux action
    }
    return Promise.reject(error);
  }
);

export default apiClient;
