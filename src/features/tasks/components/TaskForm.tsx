import { useCreateTaskForm } from "@/features/tasks/hooks/useCreateTaskForm";
import type { UserViewModel } from "@/types/users";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { CreateTaskFormData } from "@/features/tasks/schemas/createTaskSchema";
import { Input } from "@/components/ui/Input";
import { ChevronRight, Loader, Star, X } from "lucide-react";
import { togglePopover } from "@/utils/popovers";
import { usersApi } from "@/api/users/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/api/categories/api";
import { PopoverPortal } from "@/components/layout/PopoverPortal";
import { getCategoryColor } from "@/utils/calendar";
import type { CategoryGetResponse } from "@/api/categories/types";
import type { EventModalMode } from "@/store/eventModalStore";
import { tasksApi } from "@/api/tasks/api";
import { format } from "date-fns";
import type { UpdateTaskRequest } from "@/api/tasks/types";
import type { TaskViewModel } from "@/types/tasks";
import { transformTaskFormToUpdateRequest } from "../utils/transformTaskFormToUpdate";

interface TaskFormProps {
  mode: EventModalMode;
  taskId: string | null;
  onClose: () => void;
  onReset?: () => void;
}

export interface TaskFormHandle {
  reset: () => void;
}

const TaskForm = forwardRef<TaskFormHandle, TaskFormProps>(
  ({ onClose, mode, taskId }, ref) => {
    // form arrays:
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
      []
    );
    const [selectedUsers, setSelectedUsers] = useState<UserViewModel[]>([]);
    const [availableUsers, setAvailableUsers] = useState<UserViewModel[]>([]);

    // flags:
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [noColor, setNoColor] = useState(true);
    const [fullDay, setFullDay] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // temporary form's fields
    const [searchQuery, setSearchQuery] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");

    // states for popovers:
    /// share popover:
    const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);
    const divShareRef = useRef<HTMLDivElement>(null);
    const [sharePopoverPosition, setSharePopoverPosition] = useState({
      top: 0,
      left: 0,
    });

    /// category popover:
    const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
    const divCategoryRef = useRef<HTMLDivElement>(null);
    const [categoryPopoverPosition, setCategoryPopoverPosition] = useState({
      top: 0,
      left: 0,
    });

    const {
      data: taskData,
      isLoading: isTaskLoading,
      isError: isTaskError,
    } = useQuery({
      queryKey: ["task", taskId],
      queryFn: () =>
        taskId ? tasksApi.getById(taskId) : Promise.resolve(null),
      enabled: mode === "edit" && !!taskId,
    });

    const onModalClose = () => {
      setSelectedCategoryIds([]);
      setSelectedUsers([]);
      setShowAdditionalFields(false);
      setNoColor(true);
      setFullDay(false);
    };

    const {
      reset,
      register,
      onSubmit,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useCreateTaskForm({
      onSuccess: onClose,
      onModalClose: onModalClose,
    });

    useEffect(() => {
      if (mode === "create") {
        // Сброс при создании (на всякий случай)
        reset();
        setSelectedUsers([]);
        setSelectedCategoryIds([]);
        setShowAdditionalFields(false);
        setFullDay(false);
        setNoColor(true);
        return;
      }

      // Режим редактирования
      if (mode === "edit" && taskData) {
        const task = taskData.task;

        reset({
          title: task.title || "",
          address: task.address || "",
          description: task.description || "",
          // Даты:
          startDate: task.startDate ? format(task.startDate, "yyyy-MM-dd") : "",
          startTime: task.startDate ? format(task.startDate, "HH:mm") : "",
          endDate: task.endDate ? format(task.endDate, "yyyy-MM-dd") : "",
          endTime: task.endDate ? format(task.endDate, "HH:mm") : "",
          fullDay: task.endDate == null,
          color: task.color || null,
        });

        // 2. Участники
        const shares = task.shares || [];
        const users = taskData.users || [];
        const sharedUsers = shares
          .map((share) => users.find((u) => u.id === share.sharedWithUserId))
          .filter(Boolean) as UserViewModel[];
        setSelectedUsers(sharedUsers);

        // 3. Категории
        const categories = task.categories || [];
        const categoryIds = categories
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .map((link) => link.categoryId);
        setSelectedCategoryIds(categoryIds);

        // 4. Доп. поля
        setShowAdditionalFields(true);

        // 5. Full day
        const isFullDay = !task.endDate;
        setFullDay(isFullDay);

        // 6. Цвет
        setNoColor(!task.color);
      }
    }, [mode, taskData, reset]);

    const handleReset = useCallback(() => {
      reset();
      onModalClose();
    }, []);

    useImperativeHandle(ref, () => ({ reset: handleReset }), [handleReset]);

    useEffect(() => {
      if (
        searchQuery.lastIndexOf("@") != -1 &&
        searchQuery.lastIndexOf("@") == searchQuery.indexOf("@") &&
        searchQuery.charAt(searchQuery.length - 1) == "@"
      ) {
        usersApi
          .matchEmails({ emailPrefix: searchQuery })
          .then((response) => setAvailableUsers(response.users))
          .catch(() => setAvailableUsers([]));
      } else if (searchQuery.indexOf("@") == -1) {
        setAvailableUsers([]);
      }
    }, [searchQuery]);

    useEffect(() => {
      if (!isSharePopoverOpen && !isCategoryPopoverOpen) return;

      const handleResize = () => {
        setIsSharePopoverOpen(false);
        setIsCategoryPopoverOpen(false);
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
      };
    }, [isSharePopoverOpen, isCategoryPopoverOpen]);

    const queryClient = useQueryClient();

    const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
        tasksApi.update(id, data),
      onSuccess: (updatedTask) => {
        if (!updatedTask) return;
        const taskId = updatedTask.taskId;

        queryClient.setQueryData(
          ["tasks"],
          (
            old:
              | { tasks: TaskViewModel[]; authors: UserViewModel[] }
              | undefined
          ) => {
            if (!old) return old;
            return {
              ...old,
              tasks: old.tasks.map((task) =>
                task.taskId === taskId ? updatedTask : task
              ),
            };
          }
        );

        queryClient.refetchQueries({ queryKey: ["task", taskId] });

        onClose();
        onModalClose();
      },
    });

    const {
      data: availableCategories,
      isLoading: isCategoriesLoading,
      isError: isCategoriesError,
    } = useQuery({
      queryKey: ["categories"],
      queryFn: categoriesApi.getAll,
      staleTime: 2 * 60 * 1000,
    });

    const { mutateAsync: createCategory, isPending: isCreatePending } =
      useMutation({
        mutationFn: (category: { name: string; color: string }) =>
          categoriesApi.create(category),
        onSuccess: (newCategory) => {
          if (newCategory) {
            queryClient.setQueryData<CategoryGetResponse>(
              ["categories"],
              (oldData) => {
                if (!oldData) {
                  return { categories: [newCategory] };
                }

                return {
                  ...oldData,
                  categories: [...oldData.categories, newCategory],
                };
              }
            );
          }
          setNewCategoryName("");
          setNewCategoryColor("#3b82f6");
          setIsCreating(false);
          setIsCategoryPopoverOpen(false);
        },
        onError: (error) => {
          console.error("Не удалось создать категорию", error);
        },
      });

    const onSubmitWrapper = (data: CreateTaskFormData) => {
      const payload: CreateTaskFormData = {
        title: data.title,
        shares: selectedUsers.map((u) => ({ sharedWithUserId: u.id })),
      };

      if (data.address != null) payload.address = data.address;
      if (data.description != null) payload.description = data.description;

      if (showAdditionalFields) {
        payload.fullDay = data.fullDay;
        if (noColor) {
          payload.color = null;
        } else {
          payload.color = data.color;
        }
        if (data.startDate) payload.startDate = data.startDate;
        if (data.startTime) payload.startTime = data.startTime;

        if (!fullDay) {
          if (data.endDate) payload.endDate = data.endDate;
          if (data.endTime) payload.endTime = data.endTime;
        }

        if (selectedCategoryIds.length > 0) {
          payload.categoryIds = selectedCategoryIds.map((id, i) => ({
            categoryId: id,
            priority: i + 1,
          }));
        }
      }

      console.log(payload);
      if (mode === "create") {
        onSubmit(payload);
      } else if (mode === "edit" && taskId) {
        const updatePayload = transformTaskFormToUpdateRequest(data, {
          showAdditionalFields,
          fullDay,
          selectedCategoryIds,
          selectedUsers,
          noColor,
        });

        console.log(updatePayload);
        updateMutation.mutate({ id: taskId, data: updatePayload });
      }
    };

    if (mode === "edit" && isTaskLoading) {
      return (
        <div className="flex items-center justify-center h-32">
          <Loader size={24} className="text-[#CFA492]" />
        </div>
      );
    }

    if (mode === "edit" && isTaskError) {
      return <div className="text-red-500">Не удалось загрузить задачу</div>;
    }

    return (
      <form
        onSubmit={handleSubmit(onSubmitWrapper)}
        className="flex flex-col flex-shrink-1 min-h-0"
      >
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
          {/* Поле название события */}
          <div>
            <label className="block text-sm text-[#4A403A] mb-2">
              Название события
            </label>
            <Input
              {...register("title")}
              type="text"
              className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
              error={errors.title?.message || errors.description?.message}
              errorClassName="right-0 left-auto"
              placeholder="Введите название"
            />
          </div>

          {/* Поле участники */}
          <div className="relative mt-4">
            <label className="block text-sm text-[#4A403A] mb-2">
              Участники
            </label>

            <div
              ref={divShareRef}
              className="flex flex-wrap gap-2 items-center"
            >
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#CFA492] bg-white text-[#4A403A] text-sm"
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

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUsers((prev) =>
                        prev.filter((u) => u.id !== user.id)
                      );
                    }}
                    className="ml-1 focus:outline-none"
                    aria-label={`Удалить участника ${user.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePopover(
                    divShareRef,
                    isSharePopoverOpen,
                    setIsSharePopoverOpen,
                    setSharePopoverPosition
                  );
                  setSearchQuery("");
                }}
                className="flex items-center justify-center w-7 h-7 rounded-full text-white bg-[#CFA492] text-lg"
              >
                +
              </button>
            </div>
            {/* Popover */}
            <PopoverPortal isOpen={isSharePopoverOpen}>
              <div
                className="fixed z-50 mt-1 w-60 bg-white border border-[#CFA492] rounded-lg shadow-lg p-2"
                style={{
                  top: sharePopoverPosition.top,
                  left: sharePopoverPosition.left,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по email..."
                  className="w-full px-3 py-2 text-sm focus:outline-none border-b border-[#CFA492]"
                  autoFocus
                />

                <div className="max-h-40 overflow-y-auto hide-scrollbar">
                  {availableUsers
                    .filter(
                      (user) => !selectedUsers.some((u) => u.id === user.id)
                    )
                    .filter((user) => user.email.startsWith(searchQuery))
                    .map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSelectedUsers((prev) => [...prev, user]);
                          setIsSharePopoverOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm hover:bg-gray-50"
                      >
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt=""
                            className="w-5 h-5 rounded-full"
                          />
                        ) : user.name ? (
                          <span className="w-5 h-5 rounded-full bg-[#CFA492] flex items-center justify-center text-white text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        ) : null}

                        <div className="text-[#4A403A]">
                          <div>{user.name}</div>
                          {user.name && (
                            <div className="text-xs text-gray-500">
                              {user.email}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}

                  {((availableUsers.length === 0 && searchQuery.trim()) ||
                    (searchQuery.trim() &&
                      availableUsers.filter((user) =>
                        user.email.startsWith(searchQuery)
                      ).length === 0)) && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Пользователь не найден
                    </div>
                  )}
                </div>
              </div>
            </PopoverPortal>
          </div>

          {/* Поле место */}
          <div>
            <label className="block text-sm text-[#4A403A] mb-2">
              Место (опционально)
            </label>
            <Input
              {...register("address")}
              type="text"
              className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
              error={errors.address?.message}
              errorClassName="right-0 left-auto"
              placeholder="Адрес или место..."
            />
          </div>

          {/* Поле описание */}
          <div>
            <label className="block text-sm text-[#4A403A] mb-2">
              Описание (опционально)
            </label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white resize-none"
              placeholder="Дополнительная информация..."
              rows={3}
            />
          </div>

          {/* Кнопка дополнительные параметры */}
          <div
            onClick={() => {
              setShowAdditionalFields(!showAdditionalFields);
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <ChevronRight
              size={18}
              className={`text-[#CFA492] transition-transform duration-700 ${showAdditionalFields ? "rotate-90" : ""}`}
            />
            <h3 className="text-sm text-[#4A403A]">Дополнительные параметры</h3>
          </div>

          {/* Дополнительные поля */}
          <div
            className={`space-y-4 overflow-hidden transition-all duration-700 ${
              showAdditionalFields ? "max-h-[1000px]" : "max-h-0"
            }`}
          >
            {/* Поле дат */}
            <div>
              {/* Поле дата начала */}
              <label className="block text-sm text-[#4A403A] mb-2">
                Начало
              </label>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <Input
                    {...register("startDate")}
                    type="date"
                    error={errors.startDate?.message}
                    className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
                  />
                </div>
                <div>
                  <Input
                    {...register("startTime")}
                    type="time"
                    error={errors.startTime?.message}
                    className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
                  />
                </div>
              </div>

              {/* Поле дата конца */}
              <label className="block text-sm text-[#4A403A] mb-2">Конец</label>

              <div className="grid grid-cols-2 gap-4 mp-2">
                <div>
                  <Input
                    {...register("endDate")}
                    disabled={fullDay}
                    type="date"
                    className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
                    style={{ opacity: fullDay ? "20%" : "100%" }}
                  />
                </div>
                <div>
                  <Input
                    {...register("endTime")}
                    disabled={fullDay}
                    type="time"
                    className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
                    style={{ opacity: fullDay ? "20%" : "100%" }}
                    error={errors.endTime?.message}
                    errorClassName=""
                  />
                </div>
              </div>

              {/* Чекбокс: весь день */}
              <div className="flex items-center mt-3">
                <Input
                  {...register("fullDay")}
                  type="checkbox"
                  id="fullDay"
                  checked={fullDay}
                  onChange={() => setFullDay(!fullDay)}
                  className="peer sr-only"
                />
                <label
                  htmlFor="fullDay"
                  className="flex items-center justify-center w-5 h-5 border border-[#CFA492] rounded-full cursor-pointer relative"
                >
                  {fullDay && (
                    <span className="w-3 h-3 bg-[#CFA492] rounded-full"></span>
                  )}
                </label>
                <label
                  htmlFor="fullDay"
                  className="text-sm text-[#4A403A] ml-2"
                >
                  Весь день
                </label>
              </div>
            </div>

            {/* Поле категорий */}
            <div className="relative mt-4">
              <label className="block text-sm text-[#4A403A] mb-2">
                Категории
              </label>

              <div
                ref={divCategoryRef}
                className="flex flex-wrap gap-2 items-center"
              >
                {!isCategoriesLoading &&
                !isCategoriesError &&
                availableCategories
                  ? selectedCategoryIds.map((id, index) => {
                      const cat = availableCategories.categories.find(
                        (c) => c.id === id
                      );
                      if (!cat) return null;
                      const catColor = getCategoryColor(cat);

                      const isFirst = index === 0;
                      return (
                        <div
                          key={id}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                            isFirst
                              ? "border-[#4A403A] bg-[#FFF8F0]"
                              : "border-[#CFA492] bg-white"
                          } text-[#4A403A] text-sm`}
                          title={cat.name}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: catColor }}
                          />
                          {cat.name}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategoryIds((prev) => [
                                id,
                                ...prev.filter((catId) => catId !== id),
                              ]);
                            }}
                            className="ml-1 text-[#CFA492] hover:text-[#A87C68] focus:outline-none"
                            aria-label="Сделать главной категорией"
                          >
                            <Star
                              className={`w-3 h-3 ${isFirst ? "fill-current" : ""} hover:fill-current`}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategoryIds((prev) =>
                                prev.filter((catId) => catId != cat.id)
                              );
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })
                  : "Загрузка категорий..."}

                {/* Кнопка "+" */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePopover(
                      divCategoryRef,
                      isCategoryPopoverOpen,
                      setIsCategoryPopoverOpen,
                      setCategoryPopoverPosition,
                      "top"
                    );
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-full text-white bg-[#CFA492] text-lg"
                >
                  +
                </button>
              </div>

              {/* Поповер выбора категорий */}
              <PopoverPortal isOpen={isCategoryPopoverOpen}>
                <div
                  className="fixed z-50 mt-[-0.5rem] w-60 bg-white border border-[#CFA492] rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto transform -translate-y-full"
                  style={{
                    top: categoryPopoverPosition.top,
                    left: categoryPopoverPosition.left,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="space-y-1">
                    {!isCategoriesError &&
                    !isCategoriesLoading &&
                    availableCategories
                      ? availableCategories.categories.map((cat) => {
                          const isSelected = selectedCategoryIds.includes(
                            cat.id
                          );
                          const catColor = getCategoryColor(cat);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                if (!isSelected) {
                                  setSelectedCategoryIds((prev) => [
                                    ...prev,
                                    cat.id,
                                  ]);
                                } else {
                                  setSelectedCategoryIds((prev) =>
                                    prev.filter((catId) => catId != cat.id)
                                  );
                                }
                                setIsCategoryPopoverOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm ${
                                isSelected ? "bg-[#E6F0FF]" : "hover:bg-gray-50"
                              }`}
                            >
                              {isSelected ? (
                                <span className="w-4 h-4 flex items-center justify-center text-[#4A403A]">
                                  ✕
                                </span>
                              ) : (
                                <span
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: catColor }}
                                />
                              )}
                              {cat.name}
                            </button>
                          );
                        })
                      : "Загрузка категорий..."}
                  </div>

                  {isCreating ? (
                    <div className="mt-3 pt-3 border-t border-[#CFA492] space-y-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Название категории"
                        className="w-full px-3 py-1.5 text-sm border border-[#CFA492] rounded focus:outline-none focus:ring-1 focus:ring-[#CFA492]"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newCategoryColor}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onChange={(e) => setNewCategoryColor(e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600">
                          Цвет категории
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!newCategoryName.trim()) return;
                            try {
                              console.log({
                                name: newCategoryName.trim(),
                                color: newCategoryColor,
                              });
                              const newCat = await createCategory({
                                name: newCategoryName.trim(),
                                color: newCategoryColor,
                              });
                              if (newCat) {
                                setSelectedCategoryIds((prev) => [
                                  ...prev,
                                  newCat.id,
                                ]);
                              }
                            } catch (error) {
                              console.error(
                                "Не удалось создать категорию",
                                error
                              );
                            }
                          }}
                          disabled={isCreatePending || !newCategoryName.trim()}
                          className="px-3 py-1 text-sm bg-[#CFA492] text-white rounded hover:bg-[#b88f7a] disabled:opacity-50"
                        >
                          {isCreatePending ? "Создание..." : "Создать"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsCreating(false);
                            setNewCategoryName("");
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCreating(true);
                      }}
                      className="w-full mt-2 pt-2 border-t text-sm text-[#CFA492] text-left px-3"
                    >
                      + Создать категорию
                    </button>
                  )}
                </div>
              </PopoverPortal>
            </div>

            {/* Поле цвета задачи */}
            <div className="mt-4">
              <label className="block text-sm text-[#4A403A] mb-2">
                Цвет задачи
              </label>

              <Input
                {...register("color")}
                type="color"
                disabled={noColor}
                className={`w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white ${noColor ? "opacity-10" : ""}`}
              />

              {/* Чекбокс: без цвета */}
              <div className="flex items-center mt-3">
                <Input
                  type="checkbox"
                  id="noColor"
                  checked={noColor}
                  onChange={() => setNoColor(!noColor)}
                  className="peer sr-only"
                />
                <label
                  htmlFor="noColor"
                  className="flex items-center justify-center w-5 h-5 border border-[#CFA492] rounded-full cursor-pointer relative"
                >
                  {noColor && (
                    <span className="w-3 h-3 bg-[#CFA492] rounded-full"></span>
                  )}
                </label>
                <label
                  htmlFor="noColor"
                  className="text-sm text-[#4A403A] ml-2"
                >
                  Без цвета
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              handleReset();
              onClose();
            }}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-[#CFA492] text-[#4A403A] rounded-lg hover:bg-[#FFE3C7] transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-[#CFA492] text-white rounded-lg hover:bg-[#B88976] transition-colors"
          >
            Сохранить
          </button>
        </div>
      </form>
    );
  }
);

export default TaskForm;
