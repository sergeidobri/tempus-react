import type { CategoryModel } from "@/types/tasks";
import apiClient from "../apiClient";
import { CATEGORIES_ENDPOINTS } from "./endpoints";
import type {
  CategoryCreateRequest,
  CategoryCreateResponse,
  CategoryGetResponse,
  UpdateCategoryRequest,
} from "./types";

// const categories = [
//   { id: "sys-edu", name: "Образование", color: null, authorId: null },
//   { id: "sys-work", name: "Работа", color: null, authorId: null },
//   { id: "sys-hobby", name: "Хобби", color: null, authorId: null },
//   { id: "sys-health", name: "Здоровье", color: null, authorId: null },
//   { id: "sys-sport", name: "Спорт", color: null, authorId: null },
//   { id: "sys-ent", name: "Развлечения", color: null, authorId: null },
//   { id: "sys-travel", name: "Путешествие", color: null, authorId: null },
//   { id: "sys-shop", name: "Покупки", color: null, authorId: null },
//   { id: "sys-docs", name: "Документы", color: null, authorId: null },
//   { id: "sys-meetings", name: "Встречи", color: null, authorId: null },
//   { id: "sys-home", name: "Быт", color: null, authorId: null },
//   { id: "sys-relationships", name: "Отношения", color: null, authorId: null },
//   { id: "sys-beauty", name: "Красота", color: null, authorId: null },
// ];

interface UpdateProps {
  id: string;
  data: UpdateCategoryRequest;
}

export const categoriesApi = {
  getAll: async (): Promise<CategoryGetResponse> => {
    try {
      const response = await apiClient.get(CATEGORIES_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error(error);
      return { categories: [] };
    }
  },

  create: async (
    category: CategoryCreateRequest
  ): Promise<CategoryCreateResponse | null> => {
    try {
      const response = await apiClient.post(
        CATEGORIES_ENDPOINTS.CREATE_CATEGORY,
        category
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  delete: async (id: string) => {
    return await apiClient.delete(
      `${CATEGORIES_ENDPOINTS.DELETE}/${encodeURIComponent(id)}`
    );
  },

  update: async ({ id, data }: UpdateProps): Promise<CategoryModel> => {
    return await apiClient.patch(
      `${CATEGORIES_ENDPOINTS.UPDATE}/${encodeURIComponent(id)}`,
      data
    );
  },
};
