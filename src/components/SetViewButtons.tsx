import type { ViewMode } from "@/App";

interface Props {
  setViewMode: (mode: ViewMode) => void;
  getViewMode: () => ViewMode;
}

const SetViewButtons = ({ setViewMode, getViewMode }: Props) => {
  return (
    <div className="flex justify-start gap-2 p-2 w-fit">
      <button
        onClick={() => setViewMode("day")}
        className={`px-6 py-2 rounded-lg transition-colors ${
          getViewMode() === "day"
            ? "bg-[#CFA492] text-white"
            : "text-[#4A403A] hover:bg-[#FFF5EB]"
        }`}
      >
        День
      </button>
      <button
        onClick={() => setViewMode("week")}
        className={`px-6 py-2 rounded-lg transition-colors ${
          getViewMode() === "week"
            ? "bg-[#CFA492] text-white"
            : "text-[#4A403A] hover:bg-[#FFF5EB]"
        }`}
      >
        Неделя
      </button>
      <button
        onClick={() => setViewMode("month")}
        className={`px-6 py-2 rounded-lg transition-colors ${
          getViewMode() === "month"
            ? "bg-[#CFA492] text-white"
            : "text-[#4A403A] hover:bg-[#FFF5EB]"
        }`}
      >
        Месяц
      </button>
    </div>
  );
};

export default SetViewButtons;
