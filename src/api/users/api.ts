import type {
  MatchEmailRequest,
  MatchEmailResponse,
  ProfileGetResponse,
} from "./types";
import apiClient from "../apiClient";
import { USERS_ENDPOINTS } from "./endpoints";

export const usersApi = {
  matchEmails: async (data: MatchEmailRequest): Promise<MatchEmailResponse> => {
    try {
      const response = await apiClient.post(USERS_ENDPOINTS.MATCH_EMAILS, data);
      return response.data;
    } catch (error) {
      console.error(error);
      return { users: [] };
    }
  },

  getProfile: async (): Promise<ProfileGetResponse | null> => {
    try {
      const response = await apiClient.get(USERS_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
