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

export interface CategoryViewModel {
  id: string;
  name: string;
  color: string;
}
