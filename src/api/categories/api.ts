import type { CategoryCreateRequest } from "./types";

export const categoriesApi = {
  create: async (category: CategoryCreateRequest) => {
    return Promise.resolve({
      id: `${category.color}-${category.name}`,
      ...category,
    });
  },
};
