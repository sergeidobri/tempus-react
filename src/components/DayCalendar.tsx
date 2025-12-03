import {
  getEventsForDay,
  EVENT_COLORS,
  isToday,
  hexToRgba,
  getColorByLabel,
  formatTimeFromString as formatTime,
} from "../utils/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SetViewButtons from "./SetViewButtons";
import type { ViewMode } from "@/App";
import type { TaskViewModel } from "@/types/tasks";

interface DayCalendarProps {
  selectedDate: Date;
  events: TaskViewModel[];
  onDateChange: (increment: number) => void;
  setViewMode: (mode: ViewMode) => void;
  getViewMode: () => ViewMode;
}

export function DayCalendar({
  selectedDate,
  events,
  onDateChange,
  setViewMode,
  getViewMode,
}: DayCalendarProps) {
  const dayEvents = getEventsForDay(events, selectedDate);
  const isTodayDate = isToday(selectedDate);

  // Generate time slots from 00:00 to 23:00
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const getEventPosition = (event: TaskViewModel) => {
    // const [startHour, startMin] = event.startDate
    //   .split("T")[1]
    //   .split(":")
    //   .map(Number);
    // const [endHour, endMin] = event.endDate
    //   .split("T")[1]
    //   .split(":")
    //   .map(Number);

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    return {
      top: `${(startMinutes / 60) * 80}px`,
      height: `${Math.max((duration / 60) * 80, 40)}px`,
    };
  };

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

  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-[#FFE3C7]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <SetViewButtons setViewMode={setViewMode} getViewMode={getViewMode} />
        <div className="flex items-center justify-between w-1/2">
          <button
            onClick={() => onDateChange(-1)}
            className="p-2 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-[#4A403A]" />
          </button>
          <div className="text-center">
            <h2 className="text-[#4A403A]">
              {days[selectedDate.getDay()]}, {selectedDate.getDate()}{" "}
              {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h2>
            {isTodayDate && <p className="text-sm text-[#CFA492]">Сегодня</p>}
          </div>
          <button
            onClick={() => onDateChange(1)}
            className="p-2 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-[#4A403A]" />
          </button>
        </div>
      </div>

      {/* Day Timeline */}
      <div className="grid grid-cols-[80px_1fr] gap-4">
        {/* Time Labels */}
        <div className="relative mt-[10px]">
          {timeSlots.map((time, idx) => (
            <div
              key={time}
              className="absolute text-sm text-[#a4a4a4] text-right -mt-3"
              style={{ top: `${idx * 80}px`, right: 0 }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Events Timeline */}
        <div className="relative border-l">
          {/* Hour Lines */}
          {timeSlots.map((time, idx) => (
            <div
              key={time}
              className="absolute left-0 right-0 border-t"
              style={{ top: `${idx * 80}px` }}
            />
          ))}

          {/* Events */}
          {dayEvents.map((event) => {
            const position = getEventPosition(event);
            const eventColor = event.color
              ? event.color
              : getColorByLabel(event.category1Id);
            return (
              <div
                key={event.id}
                className="absolute left-4 right-4 rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                style={{
                  ...position,
                  backgroundColor: `${
                    EVENT_COLORS.find((elem) => elem.label == event.category1Id)
                      ?.color
                      ? hexToRgba(eventColor, 0.1)
                      : "transparent"
                  }`,
                  borderLeft: `4px solid ${eventColor}`,
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4
                    className="text-[#4A403A]"
                    style={{
                      color: eventColor,
                    }}
                  >
                    {event.title}
                  </h4>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 ml-2"
                    style={{
                      backgroundColor: eventColor,
                    }}
                  />
                </div>
                <p className="text-sm text-[#4A403A]/70 mb-1">
                  {formatTime(event.startDate)}-{formatTime(event.endDate)}
                </p>
                {event.address && (
                  <p className="text-sm text-[#4A403A]/60">
                    📍 {event.address}
                  </p>
                )}
                {event.description && (
                  <p className="text-sm text-[#4A403A]/60 mt-2">
                    {event.description}
                  </p>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {dayEvents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[#4A403A]/50">Нет событий на этот день</p>
            </div>
          )}

          {/* Height spacer */}
          <div style={{ height: `${timeSlots.length * 80}px` }} />
        </div>
      </div>
    </div>
  );
}
