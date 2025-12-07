import type { UserViewModel } from "@/types/users";

// requests
export interface MatchEmailRequest {
  emailPrefix: string;
}

// responses
export interface MatchEmailResponse {
  users: UserViewModel[];
}

export interface ProfileGetResponse {
  email: string;
  name: string;
  avatarUrl: string | null;
}
