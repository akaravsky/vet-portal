import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

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
