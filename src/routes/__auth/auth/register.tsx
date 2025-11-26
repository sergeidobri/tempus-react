import RegisterPage from "@/pages/auth/RegisterPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__auth/auth/register")({
  component: RegisterPage,
});
