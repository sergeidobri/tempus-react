import type { CreateTaskFormData } from "../schemas/createTaskSchema";
import type { UpdateTaskRequest } from "@/api/tasks/types";
import { stringDateToISOString } from "@/utils/calendar";

export const transformTaskFormToUpdateRequest = (
  data: CreateTaskFormData,
  options: {
    showAdditionalFields: boolean;
    fullDay: boolean;
    selectedCategoryIds: string[];
    selectedUsers: { id: string }[];
    noColor: boolean;
  }
): UpdateTaskRequest => {
  const {
    showAdditionalFields,
    fullDay,
    selectedCategoryIds,
    selectedUsers,
    noColor,
  } = options;

  const rawRequest: UpdateTaskRequest = {
    title: data.title,
    shares: selectedUsers.map((u) => ({ sharedWithUserId: u.id })),
  };

  // Опциональные поля — только если они заданы
  if (data.address) rawRequest.address = data.address;
  if (data.description) rawRequest.description = data.description;

  if (showAdditionalFields) {
    // Склеиваем даты
    if (data.startDate && data.startTime) {
      rawRequest.startDate = stringDateToISOString(
        `${data.startDate}T${data.startTime}`
      );
    }

    if (!fullDay && data.endDate && data.endTime) {
      rawRequest.endDate = stringDateToISOString(
        `${data.endDate}T${data.endTime}`
      );
    }

    // Категории
    if (selectedCategoryIds.length > 0) {
      rawRequest.categories = selectedCategoryIds.map((categoryId, index) => ({
        categoryId,
        priority: index + 1,
      }));
    }

    // Цвет
    if (!noColor && data.color) {
      rawRequest.color = data.color;
    }
  }

  const cleaned = Object.fromEntries(
    Object.entries(rawRequest).filter(([key, value]) => {
      if (key == "shares") return true;
      if (value == null) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
  );

  return cleaned as UpdateTaskRequest;
};
