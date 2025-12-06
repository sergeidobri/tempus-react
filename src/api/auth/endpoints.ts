export const AUTH_ENDPOINTS = {
  REGISTER: "/api/account/register",
  LOGIN: "/api/account/login",
  REFRESH: "/api/account/login",
  LOGOUT: "/api/account/exit",
  CHANGE_PASSWORD: "/api/accountauth/change-password",
  CONFIRM_EMAIL: "/api/account/confirm-email",
} as const;
