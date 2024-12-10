import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
console.log("API Base URL:", baseURL);

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log all requests for debugging
api.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}`;
  console.log("Request:", {
    method: config.method,
    fullUrl,
    headers: config.headers,
  });
  return config;
});

// Log all responses for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      status: response.status,
      data: response.data,
      url: `${response.config.baseURL}${response.config.url}`,
    });
    return response;
  },
  (error) => {
    console.log("Error Response:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config
        ? `${error.config.baseURL}${error.config.url}`
        : "unknown",
      message: error.message,
    });
    return Promise.reject(error);
  },
);

export const setupInterceptors = (getToken: () => string | null) => {
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};

export default api;
