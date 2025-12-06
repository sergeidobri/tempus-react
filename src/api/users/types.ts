import type { UserViewModel } from "@/types/users";

// requests
export interface MatchEmailRequest {
  emailPrefix: string;
}

// responses
export interface MatchEmailResponse {
  users: UserViewModel[];
}
