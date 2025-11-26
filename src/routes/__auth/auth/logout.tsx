import { authApi } from "@/api/auth/api";
import { useAuthStore } from "@/store/authStore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/__auth/auth/logout")({
  beforeLoad: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Logout API error (ignoring):", error);
    } finally {
      useAuthStore.getState().clearAuth();
    }

    throw redirect({ to: "/auth/login" });
  },

  component: () => null,
});
