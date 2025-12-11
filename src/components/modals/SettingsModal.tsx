import { categoriesApi } from "@/api/categories/api";
import { weatherApi } from "@/api/weather/api";
import type { CityObject } from "@/api/weather/types";
import { useLocationStore } from "@/store/locationStore";
import { getCategoryColor } from "@/utils/calendar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CategoryItem } from "../ui/CategoryItem";
import type { CategoryModel } from "@/types/tasks";

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    name: string;
    isSystem: boolean;
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [query, setQuery] = useState("");
  const [isCityEditing, setIsCityEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<CityObject[]>([]);
  const { city, country, setLocation } = useLocationStore();
  const timeoutRef = useRef<number | null>(null);

  const startEditing = () => {
    setQuery(city || "");
    setIsCityEditing(true);
  };

  const cancelEditing = () => {
    setQuery("");
    setSuggestions([]);
    setIsCityEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    const id = window.setTimeout(async () => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const cities = await weatherApi.getGeocode({ prompt: value.trim() });
        const uniqueCities = Array.from(
          new Map(
            cities.map((city) => [`${city.name}|${city.country}`, city])
          ).values()
        );
        setSuggestions(uniqueCities);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Geocoding error:", error);
        }
      }
    }, 300);

    timeoutRef.current = id;
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSelect = (item: CityObject) => {
    setLocation(item.name, item.country, item.latitude, item.longitude);
    cancelEditing();
  };

  const {
    data = { categories: [] },
    isPending,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
    staleTime: 2 * 60 * 1000,
  });

  const systemCategories = data.categories.filter((cat) => !cat.color);
  const userCategories = data.categories.filter((cat) => !!cat.color);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, color }: { id: string; color: string }) =>
      categoriesApi.update({ id, data: { color } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (category: { name: string; color: string }) =>
      categoriesApi.create(category),
    onSuccess: (newCategory) => {
      if (newCategory) {
        queryClient.setQueryData<{ categories: CategoryModel[] }>(
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
    },
    onError: (error) => {
      console.error("Не удалось создать категорию", error);
    },
  });

  const openDeleteConfirmation = (
    id: string,
    name: string,
    isSystem: boolean
  ) => {
    setCategoryToDelete({ id, name, isSystem });
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setCategoryToDelete(null);
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-lg shadow-xl overflow-y-auto w-full max-w-md mx-4 p-6 flex max-h-[90vh] flex-col custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center flex-shrink-0 justify-between mb-6">
          <h2 className="text-[#4A403A]">Настройки</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <X size={20} className="text-[#4A403A]" />
          </button>
        </div>

        {/* Блок выбора локации */}
        <div className="space-y-2">
          <div className="block text-sm text-[#4A403A]">Город</div>

          {isCityEditing ? (
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Введите город..."
                className="w-full px-3 py-2 border border-[#CFA492] rounded-lg text-[#4A403A] focus:outline-none focus:ring-1 focus:ring-[#CFA492]"
                autoFocus
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-[#CFA492] rounded-lg shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((city, index) => (
                    <li
                      key={`${city.name}-${city.country}-${index}`}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-[#4A403A] text-sm"
                      onClick={() => handleSelect(city)}
                    >
                      {city.name}, {city.country}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-3 py-1.5 text-sm text-[#4A403A] hover:text-[#CFA492]"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-[#4A403A]">
                {city && country ? (
                  <>
                    <span className="font-medium">{city}</span>, {country}
                  </>
                ) : (
                  <span className="text-gray-400">Не задано</span>
                )}
              </div>
              <button
                type="button"
                onClick={startEditing}
                className="text-sm text-[#CFA492] hover:underline"
              >
                Изменить
              </button>
            </div>
          )}
        </div>

        {/* Блок настройка категорий */}
        <div className="mt-8 pt-6 border-t border-[#E0D6D1]">
          <h3 className="block text-sm text-[#4A403A] mb-4">
            Настройка категорий
          </h3>

          {isPending ? (
            <p className="text-sm text-gray-500">Загрузка...</p>
          ) : isError ? (
            <p className="text-sm text-red-500">Ошибка загрузки категорий</p>
          ) : (
            <div className="space-y-4">
              {/* Системные категории */}
              {systemCategories.length > 0 && (
                <>
                  <p className="text-xs text-[#7A6E68] font-medium">
                    По умолчанию
                  </p>
                  <div className="space-y-3">
                    {systemCategories.map((cat) => {
                      const displayColor = getCategoryColor(cat);
                      return (
                        <CategoryItem
                          key={cat.id}
                          category={cat}
                          displayColor={displayColor}
                          hasUserColor={!!cat.color}
                          onColorChange={(newColor: string) =>
                            updateMutation.mutate({
                              id: cat.id,
                              color: newColor,
                            })
                          }
                          onDelete={() =>
                            openDeleteConfirmation(
                              cat.id,
                              cat.name,
                              cat.isSystem
                            )
                          }
                        />
                      );
                    })}
                  </div>
                </>
              )}

              {/* Пользовательские категории */}
              {userCategories.length > 0 && (
                <>
                  <p className="text-xs text-[#7A6E68] font-medium">
                    Мои категории
                  </p>
                  <div className="space-y-3">
                    {userCategories.map((cat) => {
                      const displayColor = getCategoryColor(cat);
                      return (
                        <CategoryItem
                          key={cat.id}
                          category={cat}
                          displayColor={displayColor}
                          hasUserColor={!!cat.color}
                          onColorChange={(newColor: string) =>
                            updateMutation.mutate({
                              id: cat.id,
                              color: newColor,
                            })
                          }
                          onDelete={() =>
                            openDeleteConfirmation(
                              cat.id,
                              cat.name,
                              cat.isSystem
                            )
                          }
                        />
                      );
                    })}
                  </div>
                </>
              )}

              {data.categories.length === 0 && (
                <p className="text-sm text-gray-500">Нет категорий</p>
              )}
            </div>
          )}
        </div>

        {/* Кнопка и форма создания категории */}
        <div className="mt-6">
          {isCreating ? (
            <div className="space-y-3 pt-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Название категории"
                className="w-full px-3 py-1.5 text-sm border border-[#CFA492] rounded focus:outline-none focus:ring-1 focus:ring-[#CFA492]"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-[#4A403A]">Цвет категории</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!newCategoryName.trim()) return;
                    createMutation.mutate({
                      name: newCategoryName.trim(),
                      color: newCategoryColor,
                    });
                  }}
                  disabled={createMutation.isPending || !newCategoryName.trim()}
                  className="px-3 py-1.5 text-sm bg-[#CFA492] text-white rounded hover:bg-[#b88f7a] disabled:opacity-50"
                >
                  {createMutation.isPending ? "Создание..." : "Создать"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCategoryName("");
                    setNewCategoryColor("#3b82f6");
                  }}
                  className="px-3 py-1.5 text-sm text-[#4A403A] hover:text-[#CFA492]"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="text-sm text-[#CFA492] hover:underline font-medium"
            >
              + Создать категорию
            </button>
          )}
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {categoryToDelete && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center"
          onClick={cancelDelete}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-xs mx-4 p-5 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#4A403A] text-sm">
              {categoryToDelete.isSystem
                ? `Удалить пользовательский цвет для категории «${categoryToDelete.name}»?`
                : `Удалить категорию «${categoryToDelete.name}»? Это действие нельзя отменить.`}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={cancelDelete}
                className="px-3 py-1.5 text-sm text-[#4A403A] hover:text-[#CFA492]"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsModal;
