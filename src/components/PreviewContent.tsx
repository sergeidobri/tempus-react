import { categoriesApi } from "@/api/categories/api";
import { tasksApi } from "@/api/tasks/api";
import type { GetTaskResponse } from "@/api/tasks/types";
import type { CategoryModel, TaskViewModel } from "@/types/tasks";
import type { UserViewModel } from "@/types/users";
import { getCategoryColor, getTaskColor } from "@/utils/calendar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface PreviewContentProps {
  info: GetTaskResponse;
  onEdit: () => void;
  onClose: () => void;
}

const PreviewContent = ({ info, onEdit, onClose }: PreviewContentProps) => {
  const { task, users } = info;

  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });

  if (isPending) {
    return <div>Загрузка...</div>;
  }
  if (isError) {
    return <div>Нет данных</div>;
  }

  const taskUsers = task.shares
    .map((share) => users.find((u) => u.id === share.sharedWithUserId))
    .filter(Boolean) as typeof users;

  const taskCategories = task.categories
    .sort((a, b) => {
      return a.priority - b.priority;
    })
    .map((link) => data.categories.find((c) => c.id === link.categoryId))
    .filter(Boolean) as CategoryModel[];

  const mainCategoryId = taskCategories[0]?.id;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => tasksApi.delete(taskId),
    onSuccess: () => {
      onClose();
      queryClient.setQueryData(
        ["tasks"],
        (old: { tasks: TaskViewModel[]; authors: UserViewModel[] }) => {
          return { tasks: old.tasks.filter((t) => t.taskId != task.id) };
        }
      );
    },
    onError: (error) => {
      console.error("Ошибка при удалении задачи:", error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(task.id);
    setConfirmDelete(false);
  };

  return (
    <>
      {/* Основное содержимое превью */}
      <div className="text-sm text-[#4A403A] max-w-xs break-words hyphens-auto">
        {/* Цветовая метка задачи */}
        <div className="flex gap-2 items-center">
          <div
            className="w-3 h-3 rounded-full mb-2 shrink-0"
            style={{ backgroundColor: getTaskColor(task, data.categories) }}
          />

          {/* Заголовок */}
          <h3 className="font-semibold mb-2 break-all hyphens-auto shrink">
            {task.title}
          </h3>
        </div>

        {/* Описание */}
        {task.description && (
          <p className="mb-3 whitespace-pre-wrap">{task.description}</p>
        )}

        {/* Адрес */}
        {task.address && (
          <div className="mb-3">
            <span className="font-medium">Адрес:</span> {task.address}
          </div>
        )}

        {/* Даты */}
        <div className="mb-4">
          <div>
            <span className="font-medium">Начало:</span>{" "}
            {format(task.startDate, "d MMMM yyyy HH:mm", { locale: ru })}
          </div>
          {task.endDate && (
            <div>
              <span className="font-medium">Окончание:</span>{" "}
              {format(task.endDate, "d MMMM yyyy HH:mm", { locale: ru })}
            </div>
          )}
        </div>

        {/* Участники */}
        {taskUsers.length > 0 && (
          <div className="relative mt-4">
            <label className="block text-sm font-medium mb-2">Участники</label>
            <div className="flex flex-wrap gap-2">
              {taskUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#CFA492] bg-white"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="w-4 h-4 rounded-full"
                    />
                  ) : user.name ? (
                    <span className="w-4 h-4 rounded-full bg-[#CFA492] flex items-center justify-center text-white text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : null}
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Категории */}
        {taskCategories.length > 0 && (
          <div className="relative mt-4">
            <label className="block text-sm font-medium mb-2">Категории</label>
            <div className="flex flex-wrap gap-2">
              {taskCategories.map((cat) => {
                const isFirst = cat.id === mainCategoryId;
                return (
                  <div
                    key={cat.id}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                      isFirst
                        ? "border-[#4A403A] bg-[#FFF8F0]"
                        : "border-[#CFA492] bg-white"
                    }`}
                    title={cat.name}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: getCategoryColor(cat) }}
                    />
                    {cat.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Редактировать событие"
        >
          <Pencil size={14} className="text-[#4A403A]" />
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
          aria-label="Удалить событие"
        >
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      {/* Модальное подтверждение удаления */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-5 max-w-sm w-full mx-4 shadow-lg">
            <p className="text-[#4A403A] mb-4">Удалить событие?</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 text-sm text-[#4A403A] hover:bg-gray-100 rounded"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                {deleteMutation.isPending ? "Удаление..." : "Да"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewContent;
