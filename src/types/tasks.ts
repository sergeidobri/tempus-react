import type { Category } from "@/components/EventModal";

export interface TaskViewModel {
  id: string;
  authorId: string;
  isShared: boolean;

  title: string;
  description?: string;
  address?: string;
  startDate: string;
  endDate: string;
  color?: string;

  category1Id?: Category;
}

export interface AuthorViewModel {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface CategoryViewModel {
  id: string;
  name: string;
  color: string;
}
