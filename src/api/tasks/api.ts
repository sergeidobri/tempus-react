// import apiClient from "@/api/apiClient";
// import { TASKS_ENDPOINTS } from "./endpoints";

import type { TaskViewModel } from "@/types/tasks";

const events: TaskViewModel[] = [
  {
    id: "task-1",
    authorId: "author-1",
    isShared: true,
    title: "Team Meeting",
    address: "Conference Room A",
    startDate: "2025-11-27T10:00:00",
    endDate: "2025-11-27T11:30:00",
    color: "#3b82f6",
    category1Id: "Образование",
  },
  {
    id: "task-2",
    authorId: "author-2",
    isShared: false,
    title: "Lunch with Client",
    startDate: "2025-11-28T13:00:00",
    endDate: "2025-11-28T14:00:00",
    color: "#ef4444",
  },
  {
    id: "task-3",
    authorId: "author-1",
    isShared: true,
    title: "Reminder: Submit Report",
    startDate: "2025-11-29T09:00:00",
    endDate: "2025-11-29T18:00:00",
    category1Id: "Работа",
  },
  {
    id: "task-4",
    authorId: "author-3",
    isShared: false,
    title: "Gym Session",
    startDate: "2025-11-30T18:00:00",
    endDate: "2025-11-30T19:00:00",
  },
  {
    id: "task-5",
    authorId: "author-2",
    isShared: true,
    title: "Flight to Berlin",
    address: "Moscow Sheremetyevo Airport",
    startDate: "2025-12-01T06:20:00",
    endDate: "2025-12-01T06:40:00",
    color: "#8b5cf6",
  },
  {
    id: "task-6",
    authorId: "author-1",
    isShared: false,
    title: "Birthday Party",
    address: "My Place",
    startDate: "2025-12-05T20:00:00",
    endDate: "2025-12-06T01:00:00",
    color: "#f59e0b",
    category1Id: "Развлечения",
  },
  {
    id: "task-7",
    authorId: "author-4",
    isShared: true,
    title: "Code Review",
    startDate: "2025-12-02T15:00:00",
    endDate: "2025-12-02T16:00:00",
  },
  {
    id: "task-8",
    authorId: "author-3",
    isShared: false,
    title: "Doctor Appointment",
    startDate: "2025-12-03T11:00:00",
    endDate: "2025-12-03T12:00:00",
  },
];

export const tasksApi = {
  get: () => {
    // return apiClient.get(TASKS_ENDPOINTS.GET_TASKS);
    return events;
  },
};
