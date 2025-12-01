import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createTaskSchemaWithTimeCheck,
  type CreateTaskFormData,
} from "../schemas/createTaskSchema";
import { tasksApi } from "@/api/tasks/api";
import type { CreateTaskRequest } from "@/api/tasks/types";

type UseCreateTaskFormProps = {
  onSuccess?: () => void;
  onModalClose?: () => void;
  initialDate?: Date;
};

export const useCreateTaskForm = ({
  onSuccess,
  onModalClose,
  initialDate,
}: UseCreateTaskFormProps = {}) => {
  const today = new Date();
  const defaultDate = initialDate
    ? initialDate.toISOString().split("T")[0]
    : today.toISOString().split("T")[0];

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchemaWithTimeCheck),
    defaultValues: {
      title: "",
      date: defaultDate,
      startTime: null,
      endTime: null,
      categoryIds: [],
      address: "",
      description: "",
      color: null,
    },
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    const task: CreateTaskRequest = {
      title: data.title,
      startDate:
        data.date && data.startTime ? `${data.date}T${data.startTime}` : null,
      endDate:
        data.date && data.endTime ? `${data.date}T${data.endTime}` : null,
      address: data.address || null,
      description: data.description || null,
      color: data.color || null,
      categories: data.categoryIds || [],
    };

    try {
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
