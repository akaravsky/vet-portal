import axios from "axios";

const baseURL = import.meta.env.API_URL;

const api = axios.create({
  baseURL,
});

console.log("API Base URL:", baseURL);

export const setupInterceptors = (getToken: () => string | null) => {
  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export default api;
