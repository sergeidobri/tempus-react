import {
  getMonthData,
  isSameDay,
  getEventsForDay,
  hexToRgba,
  getCategoryColorById,
  getFallBackColor,
} from "@/utils/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SetViewButtons from "@/components/ui/SetViewButtons"
import type { ViewMode } from "@/App";
import type { TaskViewModel } from "@/types/tasks";
import { PreviewFloatingTask } from "@/features/tasks/components/PreviewFloatingTask";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/api/categories/api";

interface MonthCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  events: TaskViewModel[];
  onDateSelect: (date: Date) => void;
  onMonthChange: (increment: number) => void;
  setViewMode: (mode: ViewMode) => void;
  getViewMode: () => ViewMode;
}

export function MonthCalendar({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
  onMonthChange,
  setViewMode,
  getViewMode,
}: MonthCalendarProps) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });

  const monthData = getMonthData(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const today = new Date();

  const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const getDayEvents = (day: number | null, weekIndex: number) => {
    if (day === null) return [];

    const isCurrentMonth = weekIndex > 0 || day <= 7;
    if (!isCurrentMonth && weekIndex === 0) return [];

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return getEventsForDay(events, date);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-[#FFE3C7]">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <SetViewButtons setViewMode={setViewMode} getViewMode={getViewMode} />
        <div className="flex items-center justify-between w-1/2">
          <button
            onClick={() => onMonthChange(-1)}
            className="p-2 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-[#4A403A]" />
          </button>
          <h2 className="text-[#4A403A]">
            {months[currentDate.getMonth()]}, {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => onMonthChange(1)}
            className="p-2 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-[#4A403A]" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7">
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className={`flex flex-col text-center py-2 text-sm min-h-[40px] ${
              idx >= 5 ? "text-[#CFA492]" : "text-[#4A403A]"
            } ${idx !== 6 ? "border-r" : ""}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {monthData.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            if (day === null) return <div key={`${weekIndex}-${dayIndex}`} />;

            const isCurrentMonth =
              (weekIndex > 0 && weekIndex !== monthData.length - 1) ||
              (day <= 7 && weekIndex == 0) ||
              (day > 10 && weekIndex === monthData.length - 1);
            const date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isSameDay(date, today);
            const dayEvents = getDayEvents(day, weekIndex);
            const isWeekendDay = dayIndex >= 5;

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => {
                  if (isCurrentMonth) {
                    onDateSelect(date);
                  }
                }}
                className={`
                  min-h-[140px] p-2 transition-all
                  flex flex-col items-center
                  ${!isCurrentMonth ? "text-[#4A403A]/30" : ""}
                  ${isSelected && isCurrentMonth ? "bg-[#CFA492]/10" : ""}
                  ${
                    !isSelected && !isTodayDate && isCurrentMonth
                      ? "hover:bg-[#CFA492]/10"
                      : ""
                  } ${dayIndex !== 6 ? "border-r" : ""} border-t
                `}
              >
                <div
                  className={`
                    text-sm mb-1 
                    ${
                      isTodayDate && isCurrentMonth
                        ? "w-6 h-6 rounded-full bg-[#CFA492] text-white flex items-center justify-center"
                        : ""
                    }
                    ${
                      isWeekendDay && !isTodayDate && isCurrentMonth
                        ? "text-[#CFA492]"
                        : ""
                    }
                    ${!isTodayDate && isCurrentMonth ? "text-[#4A403A]" : ""}
                  `}
                >
                  {day}
                </div>

                {/* Event indicators */}
                {dayEvents.length > 0 && isCurrentMonth && (
                  <div className="space-y-1 w-full">
                    {dayEvents.slice(0, 3).map((event, idx) => {
                      const eventColor = event.color
                        ? event.color
                        : !isPending && !isError
                          ? getCategoryColorById(
                              event.category1Id,
                              data.categories
                            )
                          : getFallBackColor();
                      return (
                        <PreviewFloatingTask key={idx} taskId={event.taskId}>
                          <div
                            className="text-xs text-center px-1.5 py-0.5 rounded truncate cursor-pointer"
                            style={{
                              backgroundColor: `${hexToRgba(eventColor, 0.1)}`,
                              color: eventColor,
                            }}
                          >
                            {event.title}
                          </div>
                        </PreviewFloatingTask>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-[#4A403A]/60 px-1.5">
                        еще +{dayEvents.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
