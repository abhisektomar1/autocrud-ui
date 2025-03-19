import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
// import { queryClient } from "./client";
import { useClearCredentials, revalidateAuth, refreshAuthToken } from "../utils/auth";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API ?? "https://api.autocrud.com",
});

api.defaults.headers.post["Content-Type"] = "application/json";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config: any) => {
  const accesstoken =
    localStorage.getItem("accesstoken") || useAuthStore.getState().accessToken;
  revalidateAuth();

  if (accesstoken && !config.url?.endsWith("/signin")){
    
    config.headers['Authorization'] = accesstoken;
    // (config.headers as AxiosRequestHeaders).Authorization = accesstoken;
    // (config.headers as AxiosRequestHeaders).id = "id";
  }
  if (config.url === "exit") {
    delete (config.headers as AxiosRequestHeaders).AccessToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAuthToken();
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }

      // If refresh failed, clear auth and redirect to login
      useClearCredentials();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;

// // Helper function to handle API responses
export const handleResponse = <T>(response: AxiosResponse<T>): T =>
  response.data;
