import { createFileRoute } from "@tanstack/react-router";
import ConfirmEmailPage from "@/pages/auth/ConfirmEmailPage";
import { z } from "zod";

const searchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/auth/confirm-email")({
  validateSearch: searchSchema,
  component: ConfirmEmailPage,
});
