import type { UserViewModel } from "@/types/users";
import type { MatchEmailRequest } from "./types";

export const users: UserViewModel[] = [
  {
    id: "user-1",
    name: "Анна Петрова",
    email: "anyapetya@email.com",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "user-2",
    name: "Иван Сидоров",
    email: "ivansidor@email.com",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "user-3",
    name: "Мария Козлова",
    email: "mashkakoza@email.com",
    avatarUrl: null,
  },
  {
    id: "user-4",
    name: "Дмитрий Лебедев",
    email: "dimaslebed@email.com",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "user-5",
    name: "Анна Петрова-Кравец",
    email: "anyapetya@krim.nash",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
  },
];

export const usersApi = {
  matchEmails: async (data: MatchEmailRequest) => {
    // return apiClient.get(TASKS_ENDPOINTS.GET_TASKS);
    return Promise.resolve(
      users.filter((user) => user.email.startsWith(data.emailPrefix))
    );
  },
};
