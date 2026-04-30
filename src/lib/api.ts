import axios from 'axios';

const api = axios.create({
  baseURL: "https://backend.awarihomes.com/api",
  // baseURL: "http://localhost:8000/api",

  timeout: 15000
});

// Response interceptor to extract error messages from backend responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message from backend response
    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'An unexpected error occurred';

    // Attach the extracted message to the error object
    error.userMessage = errorMessage;

    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;


















