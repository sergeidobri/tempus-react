import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createTaskSchemaWithTimeCheck,
  type CreateTaskFormData,
} from "../schemas/createTaskSchema";
import { tasksApi } from "@/api/tasks/api";
import type { CreateTaskRequest } from "@/api/tasks/types";
import { stringDateToISOString } from "@/utils/calendar";

type UseCreateTaskFormProps = {
  onSuccess?: () => void;
  onModalClose?: () => void;
  initialDate?: Date;
};

export const useCreateTaskForm = ({
  onSuccess,
  onModalClose,
}: UseCreateTaskFormProps = {}) => {
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchemaWithTimeCheck),
    defaultValues: {
      title: "",
      startDate: undefined,
      startTime: null,
      endDate: undefined,
      endTime: null,
      fullDay: false,
      categoryIds: [],
      shares: [],
      address: "",
      description: "",
      color: null,
    },
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    const rawTask: CreateTaskRequest = {
      title: data.title,
      startDate:
        data.startDate && data.startTime
          ? stringDateToISOString(`${data.startDate}T${data.startTime}`)
          : null,
      endDate:
        data.endDate && data.endTime && !data.fullDay
          ? stringDateToISOString(`${data.endDate}T${data.startTime}`)
          : null,
      address: data.address || null,
      description: data.description || null,
      color: data.color || null,
      categories: data.categoryIds || [],
      shares: data.shares || [],
    };

    const task = Object.fromEntries(
      Object.entries(rawTask).filter(([, value]) => {
        if (value === null || value === undefined) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    ) as CreateTaskRequest;

    try {
      console.log(task);
      await tasksApi.createTask(task);
      onSuccess?.();
      onModalClose?.();
      form.reset();
    } catch (error: any) {
      console.error("Failed to create task", error);
      const message = error.response?.data?.message || "Ошибка создания задачи";
      form.setError("root", { message });
    }
  };

  const handleClose = (onClose: () => void) => {
    const onCloseForm = () => {
      form.reset();
      onClose();
      onModalClose?.();
    };
    return onCloseForm;
  };

  return {
    ...form,
    onSubmit,
    handleClose,
  };
};
