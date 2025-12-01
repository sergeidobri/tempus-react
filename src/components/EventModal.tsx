import { useCreateTaskForm } from "@/features/tasks/hooks/useCreateTaskForm";
import { ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import type { CreateTaskFormData } from "@/features/tasks/schemas/createTaskSchema";

type CategoryItem = { id: string; name: string; color: string };

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventModal({ isOpen, onClose }: EventModalProps) {
  const [noColor, setNoColor] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [availableCategories] = useState<CategoryItem[]>([
    { id: "1", name: "Работа", color: "#CFA492" },
    { id: "2", name: "Образование", color: "#A4CFA4" },
    { id: "3", name: "Быт", color: "#8A9B6C" },
    { id: "4", name: "Работа", color: "#b85c35ff" },
    { id: "5", name: "Образование", color: "#2cf52cff" },
    { id: "6", name: "Быт", color: "#a2ff00ff" },
    { id: "7", name: "Работа", color: "#04a5d6ff" },
    { id: "8", name: "Образование", color: "#5bb65bff" },
    { id: "9", name: "Быт", color: "#eeff00ff" },
  ]); // ← позже из API

  const {
    register,
    onSubmit,
    handleSubmit,
    handleClose,
    formState: { errors, isSubmitting },
  } = useCreateTaskForm({
    onSuccess: onClose,
    onModalClose: () => {
      setSelectedCategoryIds([]);
      setShowAdditionalFields(false);
      setNoColor(true);
    },
  });

  const onSubmitWrapper = (data: CreateTaskFormData) => {
    if (!showAdditionalFields) {
      delete data.date;
      delete data.startTime;
      delete data.endTime;
      delete data.categoryIds;
      delete data.color;
    }
    if (noColor) {
      delete data.color;
    }
    return onSubmit(data);
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose(onClose)}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 flex max-h-[90vh] flex-col"
        onClick={(e) => {
          e.stopPropagation();
          setIsPopoverOpen(false);
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#4A403A]">Создать событие</h2>
          <button
            onClick={handleClose(onClose)}
            className="p-1 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <X size={20} className="text-[#4A403A]" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmitWrapper)}
          className="flex-1 overflow-y-auto space-y-4"
        >
          <div className="flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="block text-sm text-[#4A403A] mb-2">
                Название события
              </label>
              <Input
                {...register("title")}
                type="text"
                className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
                error={errors.title?.message}
                errorClassName="right-0 left-auto"
                placeholder="Введите название"
              />
            </div>

            <div>
              <label className="block text-sm text-[#4A403A] mb-2">
                Место (опционально)
              </label>
              <Input
                {...register("address")}
                type="text"
                className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
                placeholder="Адрес или место..."
              />
            </div>

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

            <div
              onClick={() => {
                setShowAdditionalFields(!showAdditionalFields);
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              <ChevronRight
                size={18}
                className={`text-[#CFA492] transition-transform duration-300 ${showAdditionalFields ? "rotate-90" : ""}`}
              />
              <h3 className="text-sm text-[#4A403A]">
                Дополнительные параметры
              </h3>
            </div>

            {showAdditionalFields && (
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#4A403A] mb-2">
                      Дата
                    </label>
                    <Input
                      {...register("date")}
                      type="date"
                      error={errors.date?.message}
                      errorClassName="right-0 left-auto"
                      className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
                    />
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#4A403A] mb-2">
                          Начало
                        </label>
                        <Input
                          {...register("startTime")}
                          type="time"
                          className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#4A403A] mb-2">
                          Конец
                        </label>
                        <Input
                          {...register("endTime")}
                          type="time"
                          className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CFA492] bg-white"
                        />
                      </div>
                    </div>

                    <div className="relative mt-4">
                      <label className="block text-sm text-[#4A403A] mb-2">
                        Категории
                      </label>

                      <div className="flex flex-wrap gap-2 items-center">
                        {selectedCategoryIds.map((id) => {
                          const cat = availableCategories.find(
                            (c) => c.id === id
                          );
                          return cat ? (
                            <div
                              key={id}
                              onClick={() => {
                                setSelectedCategoryIds((prev) =>
                                  prev.filter((catId) => catId != cat.id)
                                );
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#CFA492] bg-white text-[#4A403A] text-sm cursor-pointer"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: cat.color }}
                              />
                              {cat.name}
                            </div>
                          ) : null;
                        })}

                        {/* Кнопка "+" */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPopoverOpen(!isPopoverOpen);
                          }}
                          className="flex items-center justify-center w-7 h-7 rounded-full text-white bg-[#CFA492] text-lg"
                        >
                          +
                        </button>
                      </div>

                      {isPopoverOpen && (
                        <div
                          className="absolute z-10 mt-1 w-60 bg-white border border-[#CFA492] rounded-lg shadow-lg p-2 max-h-40 overflow-y-auto"
                          style={{ bottom: "2.5rem", left: 0 }}
                        >
                          <div className="space-y-1">
                            {availableCategories.map((cat) => {
                              const isSelected = selectedCategoryIds.includes(
                                cat.id
                              );
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
                                    setIsPopoverOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm ${
                                    isSelected
                                      ? "bg-[#E6F0FF]"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  {isSelected ? (
                                    <span className="w-4 h-4 flex items-center justify-center text-[#4A403A]">
                                      ✕
                                    </span>
                                  ) : (
                                    <span
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: cat.color }}
                                    />
                                  )}
                                  {cat.name}
                                </button>
                              );
                            })}
                          </div>

                          {/* Кнопка "Создать категорию" — пока без формы */}
                          <button
                            type="button"
                            onClick={() =>
                              console.log("Открыть форму создания")
                            }
                            className="w-full mt-2 pt-2 border-t text-sm text-[#CFA492] text-left px-3"
                          >
                            + Создать категорию
                          </button>
                        </div>
                      )}
                    </div>

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
              </div>
            )}
          </div>

          {errors.root && <div className="absolute">{errors.root.message}</div>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose(onClose)}
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
      </div>
    </div>
  );
}
