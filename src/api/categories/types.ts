import type { CategoryModel } from "@/types/tasks";

export interface CategoryCreateRequest {
  color: string;
  name: string;
}

// responses
export interface CategoryGetResponse {
  categories: CategoryModel[];
}
