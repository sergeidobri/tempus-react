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
    address: data.address,
    description: data.description,
  };

  if (showAdditionalFields) {
    if (noColor) {
      rawRequest.color = null;
    } else {
      rawRequest.color = data.color;
    }
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
    } else if (fullDay) {
      rawRequest.endDate = null;
    }

    rawRequest.categories = selectedCategoryIds.map((categoryId, index) => ({
      categoryId,
      priority: index + 1,
    }));
  }

  return rawRequest as UpdateTaskRequest;
};
