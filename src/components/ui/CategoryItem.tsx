import type { CategoryModel } from "@/types/tasks";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export const CategoryItem = ({
  category,
  displayColor,
  hasUserColor,
  onColorChange,
  onDelete,
}: {
  category: CategoryModel;
  displayColor: string;
  hasUserColor: boolean;
  onColorChange: (color: string) => void;
  onDelete: () => void;
}) => {
  const [immediateColor, setImmediateColor] = useState(displayColor);

  useEffect(() => {
    setImmediateColor(displayColor);
  }, [displayColor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setImmediateColor(newColor);
    onColorChange(newColor);
  };

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2">
        {/* Цветовой кружок с подсказкой и hover-эффектом */}
        <div className="relative" title="Нажмите, чтобы изменить цвет">
          <div
            className="w-5 h-5 rounded-full border border-[#4A403A]/20 cursor-pointer transition-all hover:scale-110 hover:shadow-sm"
            style={{ backgroundColor: immediateColor }}
          />
          <input
            type="color"
            value={immediateColor}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-[#4A403A]">{category.name}</span>
      </div>

      {/* Кнопка удаления */}
      {hasUserColor && (
        <button
          type="button"
          onClick={onDelete}
          className="p-1 text-red-500 hover:text-red-700 rounded"
          title={
            category.isSystem
              ? `Удалить цвет`
              : `Удалить категорию ${category.name}`
          }
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};
