import type { TaskCategory } from "@/types/tasks";

// requests
export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  address?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  color?: string | null;
  categories?: TaskCategory[];
  shares?: string[];
}

// responses
export interface CreateTaskResponse {
  id: string;
  authorId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  color?: string;
  categories: string[];
  shares: string[];
}
