import axios from 'axios';

// Temporarily force production URL for testing
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'https://backend-production-18b9.up.railway.app';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // This creates the full URL: https://backend-production-18b9.up.railway.app/api
});

api.interceptors.request.use((config) => {
  console.log('Making request to:', config.baseURL + config.url); // Debug log
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Add response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    console.error('Request URL:', error.config?.url);
    console.error('Base URL:', error.config?.baseURL);
    return Promise.reject(error);
  }
);

export default api;