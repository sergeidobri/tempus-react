import type { TaskViewModel } from "@/types/tasks";
import {
  getMonthData,
  isSameDay,
  getEventsForDay,
  getColorByLabel,
} from "../utils/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  events: TaskViewModel[];
  onDateSelect: (date: Date) => void;
  onMonthChange: (increment: number) => void;
}

export function MiniCalendar({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
  onMonthChange,
}: MiniCalendarProps) {
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
    <div className="bg-white rounded-lg p-4 shadow-sm border border-[#FFE3C7]">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onMonthChange(-1)}
          className="p-1 hover:bg-[#FFE3C7] rounded transition-colors"
        >
          <ChevronLeft size={16} className="text-[#4A403A]" />
        </button>
        <div className="text-sm text-[#4A403A]">
          {months[currentDate.getMonth()]}, {currentDate.getFullYear()}
        </div>
        <button
          onClick={() => onMonthChange(1)}
          className="p-1 hover:bg-[#FFE3C7] rounded transition-colors"
        >
          <ChevronRight size={16} className="text-[#4A403A]" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className="text-center text-xs text-[#4A403A] opacity-60 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
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
              <button
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => {
                  if (isCurrentMonth) {
                    onDateSelect(date);
                  }
                }}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg text-xs
                  transition-all relative
                  ${!isCurrentMonth ? "text-[#4A403A]/30" : ""}
                  ${isWeekendDay && isCurrentMonth ? "text-[#CFA492]" : ""}
                  ${isTodayDate && isCurrentMonth ? "bg-[#CFA492] text-white" : ""}
                  ${
                    isSelected && isCurrentMonth && !isTodayDate
                      ? "bg-[#FFF5EB]"
                      : ""
                  }
                  ${
                    !isSelected && !isTodayDate && isCurrentMonth
                      ? "hover:bg-[#FFF5EB]"
                      : ""
                  }
                `}
              >
                <span className="mb-0.5">{day}</span>
                {dayEvents.length > 0 && isCurrentMonth && (
                  <div className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((event, idx) => {
                      const eventColor = event.color
                        ? event.color
                        : getColorByLabel(event.category1Id);
                      return (
                        <div
                          key={idx}
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: eventColor,
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
