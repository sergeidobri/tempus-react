import {
  isSameDay,
  hexToRgba,
  getCategoryColorById,
  getFallBackColor,
} from "@/utils/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SetViewButtons from "@/components/ui/SetViewButtons";
import type { ViewMode } from "@/App";
import type { TaskViewModel } from "@/types/tasks";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/api/categories/api";

interface WeekCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  events: TaskViewModel[];
  onDateSelect: (date: Date) => void;
  onWeekChange: (increment: number) => void;
  setViewMode: (mode: ViewMode) => void;
  getViewMode: () => ViewMode;
}

export function WeekCalendar({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
  onWeekChange,
  setViewMode,
  getViewMode,
}: WeekCalendarProps) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
    staleTime: 2 * 60 * 1000,
  });

  const today = new Date();

  const getWeekDates = (date: Date): Date[] => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
  const months = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];

  const getEventPosition = (event: TaskViewModel) => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate
      ? new Date(event.endDate)
      : new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 1
        );

    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    return {
      top: `${(startMinutes / 60) * 80 + 90}px`,
      height: `${Math.max((duration / 60) * 80, 40)}px`,
    };
  };

  const handleWeekChange = (increment: number) => {
    onWeekChange(increment * 7);
  };

  const getDateRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}-${end.getDate()} ${months[start.getMonth()]}, ${start.getFullYear()}`;
    } else {
      return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}, ${start.getFullYear()}`;
    }
  };

  // Сгруппируем события по дню недели
  const eventsByDay = weekDates.map((day) =>
    events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    })
  );

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-[#FFE3C7]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <SetViewButtons setViewMode={setViewMode} getViewMode={getViewMode} />
        <div className="flex items-center justify-between w-1/2">
          <button
            onClick={() => handleWeekChange(-1)}
            className="p-2 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-[#4A403A]" />
          </button>
          <h2 className="text-[#4A403A]">{getDateRange()}</h2>
          <button
            onClick={() => handleWeekChange(1)}
            className="p-2 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-[#4A403A]" />
          </button>
        </div>
      </div>

      {/* Week Grid — без gap */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)]">
        {" "}
        {/* Убран gap-4 */}
        {/* Time Labels */}
        <div className="relative mt-[10px]">
          {Array.from({ length: 24 }).map((_, idx) => (
            <div
              key={idx}
              className="absolute text-sm text-[#a4a4a4] text-right -mt-3"
              style={{ top: `${idx * 80 + 90}px`, right: 0 }}
            >
              {`${idx.toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>
        {/* Day Columns */}
        {weekDates.map((day, dayIndex) => {
          const isTodayDate = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDate);
          const dayEvents = eventsByDay[dayIndex];

          return (
            <div
              key={dayIndex}
              className={`relative border-l min-h-[1920px] bg-white ${
                isTodayDate || isSelected ? "bg-[#FFF5EB]" : ""
              }`}
              onClick={() => onDateSelect(day)}
            >
              <div
                className="sticky top-0 bg-white z-10 p-2 text-center border-b flex flex-col items-center justify-center h-24" // h-24 = 96px, но мы используем padding
                style={{ height: "90px", lineHeight: "1.2" }}
              >
                <div className="text-xs text-[#4A403A]/60 mb-1">
                  {weekDays[dayIndex]}
                </div>
                <div
                  className={`text-sm ${
                    isTodayDate
                      ? "w-7 h-7 mx-auto rounded-full bg-[#CFA492] text-white flex items-center justify-center"
                      : isSelected
                        ? "text-[#CFA492]"
                        : "text-[#4A403A]"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
              {Array.from({ length: 24 }).map((_, idx) => (
                <div
                  key={idx}
                  className="absolute left-0 right-0 border-t"
                  style={{ top: `${idx * 80 + 90}px` }}
                />
              ))}

              {dayEvents.map((event) => {
                const position = getEventPosition(event);
                const eventColor = event.color
                  ? event.color
                  : !isPending && !isError
                    ? getCategoryColorById(event.category1Id, data?.categories)
                    : getFallBackColor();

                return (
                  <div
                    key={event.taskId}
                    className="absolute left-0 right-0 rounded-lg px-2 py-1 shadow-sm cursor-pointer hover:shadow-md transition-shadow z-10 overflow-hidden"
                    style={{
                      ...position,
                      backgroundColor: `${hexToRgba(eventColor, 0.1)}`,
                      borderLeft: `4px solid ${eventColor}`,
                      display: "flex",
                      alignItems: "center",
                      fontSize: "12px",
                      lineHeight: "16px",
                    }}
                  >
                    <span
                      className="text-[#4A403A] truncate"
                      style={{
                        color: eventColor,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {event.title}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
