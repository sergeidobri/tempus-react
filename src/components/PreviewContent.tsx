import { categoriesApi } from "@/api/categories/api";
import type { GetTaskResponse } from "@/api/tasks/types";
import type { CategoryModel } from "@/types/tasks";
import { getCategoryColor, getTaskColor } from "@/utils/calendar";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Loader } from "lucide-react";

interface PreviewContentProps {
  info: GetTaskResponse;
}

const PreviewContent = ({ info }: PreviewContentProps) => {
  const { task, users } = info;

  const { data, isPending, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });

  if (isPending) {
    return <Loader size={14} color="#CFA492" />;
  }
  if (isError) {
    return <div>Нет данных</div>;
  }

  const taskUsers = task.shares
    .map((share) => users.find((u) => u.id === share.sharedWithUserId))
    .filter(Boolean) as typeof users;

  const taskCategories = task.categories
    .map((link) => data.categories.find((c) => c.id === link.categoryId))
    .filter(Boolean) as CategoryModel[];

  const mainCategoryId = taskCategories[0]?.id;

  return (
    <div className="text-sm text-[#4A403A] max-w-xs break-words hyphens-auto">
      {/* Цветовая метка задачи */}
      <div className="flex gap-2 items-center">
        <div
          className="w-3 h-3 rounded-full mb-2"
          style={{ backgroundColor: getTaskColor(task, data.categories) }}
        />

        {/* Заголовок */}
        <h3 className="font-semibold mb-2 break-all hyphens-auto">
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
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
  );
};

export default PreviewContent;
