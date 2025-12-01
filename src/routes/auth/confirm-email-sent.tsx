import ConfirmEmailSentPage from "@/pages/auth/ConfirmEmailSentPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/confirm-email-sent")({
  component: ConfirmEmailSentPage,
});
