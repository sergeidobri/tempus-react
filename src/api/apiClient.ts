import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { AUTH_ENDPOINTS } from "./auth/endpoints";
import { navigate } from "@/utils/navigate";
import { getAccessToken, useAuthStore } from "@/store/authStore";

let isRefreshing = false;
const failedQueue: ((token: string) => void)[] = [];

const refreshApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: true,
  timeout: 10_000,
});

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: true,
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response, // при пешном запросе(2xx) -> ничего не делаем
  async (error: AxiosError) => {
    // обрабатываем ошибки сервера
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    }; // сохраняем изначальный запрос(упавший с ошибкой)
    const isRefreshRequest = error.config?.url?.includes("/auth/refresh");
    const isInvalidLoginAndPasswordRequest =
      error.config?.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !isInvalidLoginAndPasswordRequest
    ) {
      // если статус 401(Ошибка авторизации) и запрос ещё не поступал(!_retry)
      if (isRefreshing) {
        // Если уже знаем об ошибке авторизации (отправили запрос на обновление токена(isRefreshing)), то просто добавляем запрос в очередь
        return new Promise((resolve) => {
          failedQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true; // Помечаем запрос обработанным, чтобы при повторной ошибке просто его отклонить
      isRefreshing = true; // Помечаем, что сейчас будет запущен процесс обновления

      try {
        const response = await refreshApiClient.get(AUTH_ENDPOINTS.REFRESH);
        const newToken = response.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);

        failedQueue.forEach((resolve) => resolve(newToken)); // Разбираем очередь отклонённых запросов, подставляя новый токен
        failedQueue.length = 0;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest); // Повторно отправляем наш начальный запрос, вызвавший смуту
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        // navigate("/auth/login"); // При неудаче, отправляем на страницу авторизации. Не надо 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
