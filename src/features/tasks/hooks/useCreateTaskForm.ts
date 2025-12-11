import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createTaskSchemaWithTimeCheck,
  type CreateTaskFormData,
} from "../schemas/createTaskSchema";
import { tasksApi } from "@/api/tasks/api";
import type { CreateTaskRequest } from "@/api/tasks/types";
import { stringDateToISOString } from "@/utils/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TaskViewModel } from "@/types/tasks";
import type { UserViewModel } from "@/types/users";
import { AxiosError } from "axios";

type UseCreateTaskFormProps = {
  onSuccess?: () => void;
  // onModalClose?: () => void;
  initialDate?: Date;
};

export const useCreateTaskForm = ({
  onSuccess,
  // onModalClose,
}: UseCreateTaskFormProps = {}) => {
  const queryClient = useQueryClient();

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchemaWithTimeCheck),
  });

  const mutation = useMutation({
    mutationFn: (task: CreateTaskRequest) => tasksApi.create(task),
    onSuccess: (newTask) => {
      queryClient.setQueryData(
        ["tasks"],
        (old: { tasks: TaskViewModel[]; authors: UserViewModel[] }) => {
          if (!old) return { tasks: [newTask], authors: [] };
          return {
            tasks: [...old.tasks, newTask],
            authors: old.authors,
          };
        }
      );

      onSuccess?.();
      // onModalClose?.();
      form.reset();
    },
    onError: (error) => {
      let message = "Неправильный логин или пароль";

      if (error instanceof AxiosError) {
        message =
          error.response?.data?.message || "Неправильный логин или пароль";
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const err = error as { response?: { data?: { message?: string } } };
        message =
          err.response?.data?.message || "Неправильный логин или пароль";
      }
      form.setError("root", { message });
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
          ? stringDateToISOString(`${data.endDate}T${data.endTime}`)
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

    mutation.mutate(task);
  };

  return {
    ...form,
    onSubmit,
    isPending: mutation.isPending,
  };
};
