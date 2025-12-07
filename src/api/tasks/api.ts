import type {
  CreateTaskRequest,
  GetTaskResponse,
  GetTasksReponse,
  UpdateTaskRequest,
} from "./types";
import { TASKS_ENDPOINTS } from "./endpoints";
import apiClient from "../apiClient";
import type { TaskViewModel } from "@/types/tasks";

export const tasksApi = {
  get: async (): Promise<GetTasksReponse> => {
    try {
      const response = await apiClient.get(TASKS_ENDPOINTS.GET_TASKS);
      return response.data;
    } catch (error) {
      console.error(error);
      return { tasks: [], authors: [] };
    }
  },

  getById: async (id: string): Promise<GetTaskResponse | null> => {
    try {
      const response = await apiClient.get(
        `${TASKS_ENDPOINTS.GET_TASK_BY_ID}/${encodeURIComponent(id)}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  create: async (data: CreateTaskRequest): Promise<TaskViewModel | null> => {
    try {
      const response = await apiClient.post(TASKS_ENDPOINTS.CREATE_TASK, data);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  delete: async (id: string) => {
    // специально не отлавливаю ошибку
    await apiClient.delete(
      `${TASKS_ENDPOINTS.DELETE_TASK}/${encodeURIComponent(id)}`
    );
    // try {
    //   await apiClient.delete(
    //     `${TASKS_ENDPOINTS.DELETE_TASK}/${encodeURIComponent(id)}`
    //   );
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   return;
    // }
  },

  update: async (
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<TaskViewModel | null> => {
    try {
      const response = await apiClient.patch(
        `${TASKS_ENDPOINTS.UPDATE_TASK}/${encodeURIComponent(taskId)}`,
        data
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
