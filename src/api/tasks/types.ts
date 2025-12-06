import type { TaskCategory, TaskModel, TaskShare, TaskViewModel } from "@/types/tasks";
import type { UserViewModel } from "@/types/users";

// requests
export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  address?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  color?: string | null;
  categories?: TaskCategory[];
  shares?: TaskShare[];
}

export interface GetTaskByIdRequest {
  taskId: string;
}

// responses
// export interface CreateTaskResponse {
//   id: string;
//   authorId: string;
//   title: string;
//   description?: string;
//   startDate: string;
//   endDate?: string;
//   color?: string;
//   categories: string[];
//   shares: string[];
// }

export interface GetTasksReponse {
  tasks: TaskViewModel[];
  authors: UserViewModel[];
}

export interface GetTaskResponse {
  task: TaskModel;
  users: UserViewModel[];
  // categories: (ICategoryViewModel &
  //   Pick<IColorViewModel, "color" | "userId">)[];
}
