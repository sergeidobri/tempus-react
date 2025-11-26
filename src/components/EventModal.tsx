import { useState } from "react";
import { X } from "lucide-react";
import type { TaskViewModel } from "@/types/tasks";

export type Category =
  | "Образование"
  | "Работа"
  | "Хобби"
  | "Здоровье"
  | "Спорт"
  | "Развлечения"
  | "Путешествие"
  | "Покупки"
  | "Документы"
  | "Встречи"
  | "Быт"
  | "Отношения"
  | "Красота";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<TaskViewModel, "id">) => void;
  initialDate?: Date;
}

export function EventModal({
  isOpen,
  onClose,
  onSave,
  initialDate,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(
    initialDate
      ? initialDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [category, setCategory] = useState<Category>("Работа");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSave({
      authorId: "user.id", // заглушка
      isShared: false,
      title,
      startDate: `${date}T${startTime}`,
      endDate: `${date}T${endTime}`,
      category1Id: category,
      address: location || undefined,
      description: description || undefined,
    });

    // Reset form
    setTitle("");
    setStartTime("09:00");
    setEndTime("10:00");
    setCategory("Работа");
    setLocation("");
    setDescription("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#4A403A]">Создать событие</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <X size={20} className="text-[#4A403A]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#4A403A] mb-1">
              Название события
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CFA492] bg-white"
              placeholder="Введите название..."
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#4A403A] mb-1">Дата</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CFA492] bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#4A403A] mb-1">
                Начало
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CFA492] bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[#4A403A] mb-1">Конец</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CFA492] bg-white"
                required
              />
            </div>
          </div>

          {/* <div> */}
          {/* <label className="block text-sm text-[#4A403A] mb-1">
              Категория
            </label> */}
          {/* <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory("social")}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  category === "social"
                    ? "bg-[#E200B1] text-white border-[#E200B1]"
                    : "bg-white text-[#4A403A] border-[#CFA492] hover:bg-[#FFE3C7]"
                }`}
              >
                Личное
              </button>
              <button
                type="button"
                onClick={() => setCategory("work")}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  category === "work"
                    ? "bg-[#00E222] text-white border-[#00E222]"
                    : "bg-white text-[#4A403A] border-[#CFA492] hover:bg-[#FFE3C7]"
                }`}
              >
                Работа
              </button>
              <button
                type="button"
                onClick={() => setCategory("personal")}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  category === "personal"
                    ? "bg-[#00B8E2] text-white border-[#00B8E2]"
                    : "bg-white text-[#4A403A] border-[#CFA492] hover:bg-[#FFE3C7]"
                }`}
              >
                Другое
              </button>
            </div> */}
          {/* </div> */}

          <div>
            <label className="block text-sm text-[#4A403A] mb-1">
              Место (опционально)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CFA492] bg-white"
              placeholder="Адрес или место..."
            />
          </div>

          <div>
            <label className="block text-sm text-[#4A403A] mb-1">
              Описание (опционально)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-[#CFA492] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CFA492] bg-white resize-none"
              placeholder="Дополнительная информация..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#CFA492] text-[#4A403A] rounded-lg hover:bg-[#FFE3C7] transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
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
