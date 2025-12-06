// import apiClient from "@/api/apiClient";
// import { TASKS_ENDPOINTS } from "./endpoints";

import type {
  CreateTaskRequest,
  GetTaskResponse,
  GetTasksReponse,
} from "./types";
import { TASKS_ENDPOINTS } from "./endpoints";
import apiClient from "../apiClient";
import type { TaskViewModel } from "@/types/tasks";

// const events: TaskViewModel[] = [
//   {
//     id: "task-1",
//     authorId: "author-1",
//     isShared: true,
//     title: "Team Meeting",
//     address: "Conference Room A",
//     startDate: "2025-11-27T10:00:00.000Z",
//     endDate: "2025-11-27T11:30:00.000Z",
//     color: "#3b82f6",
//     category1Id: "Образование",
//   },
//   {
//     id: "task-2",
//     authorId: "author-2",
//     isShared: false,
//     title: "Lunch with Client",
//     startDate: "2025-11-28T13:00:00.000Z",
//     endDate: "2025-11-28T14:00:00.000Z",
//     color: "#ef4444",
//   },
//   {
//     id: "task-3",
//     authorId: "author-1",
//     isShared: true,
//     title: "Reminder: Submit Report",
//     startDate: "2025-11-29T09:00:00.000Z",
//     endDate: "2025-11-29T18:00:00.000Z",
//     category1Id: "Работа",
//   },
//   {
//     id: "task-4",
//     authorId: "author-3",
//     isShared: false,
//     title: "Gym Session",
//     startDate: "2025-11-30T18:00:00.000Z",
//     endDate: "2025-11-30T19:00:00.000Z",
//   },
//   {
//     id: "task-5",
//     authorId: "author-2",
//     isShared: true,
//     title: "Flight to Berlin",
//     address: "Moscow Sheremetyevo Airport",
//     startDate: "2025-12-01T06:00:00.000Z",
//     endDate: "2025-12-01T06:05:00.000Z",
//     color: "#8b5cf6",
//   },
//   {
//     id: "task-6",
//     authorId: "author-1",
//     isShared: false,
//     title: "Birthday Party",
//     address: "My Place",
//     startDate: "2025-12-05T20:00:00.000Z",
//     endDate: "2025-12-06T01:00:00.000Z",
//     color: "#f59e0b",
//     category1Id: "Развлечения",
//   },
//   {
//     id: "task-7",
//     authorId: "author-4",
//     isShared: true,
//     title: "Code Review",
//     startDate: "2025-12-02T15:00:00.000Z",
//     endDate: "2025-12-02T16:00:00.000Z",
//   },
//   {
//     id: "task-8",
//     authorId: "author-3",
//     isShared: false,
//     title: "Doctor Appointment",
//     startDate: "2025-12-03T11:00:00.000Z",
//     endDate: "2025-12-03T12:00:00.000Z",
//   },
//   {
//     id: "task-9",
//     authorId: "author-3",
//     isShared: false,
//     title: "Doctor Appointment",
//     startDate: "2025-12-03T15:00:00.000Z",
//     endDate: "2025-12-03T16:00:00.000Z",
//   },
// ];

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
    console.log(
      `fetch ${TASKS_ENDPOINTS.GET_TASK_BY_ID}/${encodeURIComponent(id)}`
    );
    try {
      const response = await apiClient.get(
        `${TASKS_ENDPOINTS.GET_TASK_BY_ID}/${encodeURIComponent(id)}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }

    // return Promise.resolve({
    //   task: {
    //     id: "task-789",
    //     authorId: "user-123",
    //     title: "Подготовить отчёт по Q3",
    //     description:
    //       "Собрать данные из всех регионов, сверить с бюджетом, подготовить презентацию для руководства.",
    //     address: "г. Москва, ул. Тверская, д. 15, каб. 304",
    //     startDate: new Date("2025-12-10T09:00:00"),
    //     endDate: new Date("2025-12-15T18:00:00"),
    //     color: null,
    //     categories: [
    //       { categoryId: "cat-1", priority: 1 },
    //       { categoryId: "cat-1", priority: 2 },
    //     ],
    //     shares: [
    //       { sharedWithUserId: "user-456" },
    //       { sharedWithUserId: "user-789" },
    //     ],
    //   },
    //   users: [
    //     {
    //       id: "user-456",
    //       name: "Анна Петрова",
    //       email: "anna@example.com",
    //       avatarUrl: "https://i.pravatar.cc/150?u=anna",
    //     },
    //     {
    //       id: "user-789",
    //       name: "Иван Сидоров",
    //       email: "ivan@example.com",
    //       avatarUrl: null,
    //     },
    //   ],
    //   // categories: [
    //   //   {
    //   //     id: "cat-1",
    //   //     name: "Отчёты",
    //   //     color: "#FF6B6B",
    //   //     userId: "user-123",
    //   //   },
    //   //   {
    //   //     id: "cat-2",
    //   //     name: "Финансы",
    //   //     color: "#4ECDC4",
    //   //     userId: "user-123",
    //   //   },
    //   // ],
    // });
  },

  createTask: async (
    data: CreateTaskRequest
  ): Promise<TaskViewModel | null> => {
    try {
      const response = await apiClient.post(TASKS_ENDPOINTS.CREATE_TASK, data);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
    // return Promise.resolve(data);
  },
};
