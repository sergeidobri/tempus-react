export interface TaskViewModel {
  userId: string;
  taskId: string;

  authorId: string;
  isShared: boolean;

  title: string;
  address: string | null;
  startDate: string;
  endDate: string | null;
  color: string | null;

  category1Id: string | null;
}

export interface TaskModel {
  id: string;
  authorId: string;

  title: string;
  description: string | null;
  address: string | null;
  startDate: Date;
  endDate: Date | null;
  color: string | null;

  categories: TaskCategory[];
  shares: TaskShare[];
}

export interface TaskShare {
  sharedWithUserId: string;
}

export interface CategoryModel {
  id: string;
  name: string;
  color: string | null;
  isSystem: boolean;
}

export const CATEGORIES = [
  "Образование",
  "Работа",
  "Хобби",
  "Здоровье",
  "Спорт",
  "Развлечения",
  "Путешествие",
  "Покупки",
  "Документы",
  "Встречи",
  "Быт",
  "Отношения",
  "Красота",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface AuthorViewModel {
  id: string;
  name: string;
  avatarUrl: string;
}

// export interface CategoryViewModel {
//   id: string;
//   name: string;
//   color: string;
// }

export interface TaskCategory {
  categoryId: string;
  priority: number;
}
