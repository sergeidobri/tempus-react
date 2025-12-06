import apiClient from "@/api/apiClient";
import { AUTH_ENDPOINTS } from "./endpoints";
import {
  type ConfirmEmailRequest,
  type LoginRequest,
  type RegisterRequest,
  type TokenResponse,
} from "./types";

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post(AUTH_ENDPOINTS.REGISTER, data),

  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>(AUTH_ENDPOINTS.LOGIN, data),

  refresh: () => apiClient.get<TokenResponse>(AUTH_ENDPOINTS.REFRESH),

  confirmEmail: (data: ConfirmEmailRequest) =>
    apiClient.post(AUTH_ENDPOINTS.CONFIRM_EMAIL, data),

  logout: () => {
    apiClient.get(AUTH_ENDPOINTS.LOGOUT);
  },
};
