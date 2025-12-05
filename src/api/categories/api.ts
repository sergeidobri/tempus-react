import { CATEGORIES } from "@/types/tasks";
import apiClient from "../apiClient";
import type { CategoryCreateRequest } from "./types";
import { CATEGORIES_ENDPOINTS } from "./endpoints";

const categories = [
  { id: "sys-edu", name: "Образование", color: null, authorId: null },
  { id: "sys-work", name: "Работа", color: null, authorId: null },
  { id: "sys-hobby", name: "Хобби", color: null, authorId: null },
  { id: "sys-health", name: "Здоровье", color: null, authorId: null },
  { id: "sys-sport", name: "Спорт", color: null, authorId: null },
  { id: "sys-ent", name: "Развлечения", color: null, authorId: null },
  { id: "sys-travel", name: "Путешествие", color: null, authorId: null },
  { id: "sys-shop", name: "Покупки", color: null, authorId: null },
  { id: "sys-docs", name: "Документы", color: null, authorId: null },
  { id: "sys-meetings", name: "Встречи", color: null, authorId: null },
  { id: "sys-home", name: "Быт", color: null, authorId: null },
  { id: "sys-relationships", name: "Отношения", color: null, authorId: null },
  { id: "sys-beauty", name: "Красота", color: null, authorId: null },
];

export const categoriesApi = {
  getAll: async () => {
    // return apiClient.get(CATEGORIES_ENDPOINTS.GET_ALL);
    return Promise.resolve({ categories });
  },
  create: async (category: CategoryCreateRequest) => {
    return Promise.resolve({
      id: `${category.color}-${category.name}`,
      ...category,
    });
  },
};
