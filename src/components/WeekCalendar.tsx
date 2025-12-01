import {
  getEventsForDay,
  isSameDay,
  hexToRgba,
  getColorByLabel,
  formatTimeFromString as formatTime,
} from "../utils/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SetViewButtons from "./SetViewButtons";
import { type ViewMode } from "@/App";
import type { TaskViewModel } from "@/types/tasks";

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
  const today = new Date();

  // Get the week containing currentDate
  const getWeekDates = (date: Date): Date[] => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    const monday = new Date(date);
    monday.setDate(diff);

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(monday);
      weekDay.setDate(monday.getDate() + i);
      week.push(weekDay);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

  // Generate time slots from 00:00 to 23:00
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const getEventPosition = (event: TaskViewModel) => {
    const [startHour, startMin] = event.startDate
      .split("T")[1]
      .split(":")
      .map(Number);
    const [endHour, endMin] = event.endDate
      .split("T")[1]
      .split(":")
      .map(Number);

    const duration = endHour * 60 + endMin - (startHour * 60 + startMin);

    return {
      height: `${(duration / 60) * 60}px`,
    };
  };

  const handleWeekChange = (increment: number) => {
    onWeekChange(increment * 7);
  };

  const getDateRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
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

    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}-${end.getDate()} ${
        months[start.getMonth()]
      }, ${start.getFullYear()}`;
    } else {
      return `${start.getDate()} ${
        months[start.getMonth()]
      } - ${end.getDate()} ${months[end.getMonth()]}, ${start.getFullYear()}`;
    }
  };

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

      {/* Week Grid */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] overflow-hidden">
        {/* Header Row */}
        <div className="bg-white p-2" />
        {weekDates.map((date, idx) => {
          const isTodayDate = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);
          const isWeekendDay = idx >= 5;

          return (
            <button
              key={idx}
              onClick={() => onDateSelect(date)}
              className={`
                bg-white p-2 text-center transition-colors
                ${isSelected && !isTodayDate ? "bg-[#FFF5EB]" : ""}
                hover:bg-[#cfa491]/10
              `}
            >
              <div className="text-xs text-[#4A403A]/60 mb-1">
                {weekDays[idx]}
              </div>
              <div
                className={`
                  text-sm
                  ${
                    isTodayDate
                      ? "w-7 h-7 mx-auto rounded-full bg-[#CFA492] text-white flex items-center justify-center"
                      : ""
                  }
                  ${
                    isWeekendDay && !isTodayDate
                      ? "text-[#CFA492]"
                      : "text-[#4A403A]"
                  }
                `}
              >
                {date.getDate()}
              </div>
            </button>
          );
        })}

        {/* Time Slots */}
        {timeSlots.map((time) => (
          <div key={time} className="contents">
            {/* Time Label */}
            <div className="bg-white p-2 text-xs text-[#4A403A]/60 text-right border-t">
              {time}
            </div>

            {/* Day Cells */}
            {weekDates.map((date, dayIdx) => {
              const dayEvents = getEventsForDay(events, date);
              const [hour] = time.split(":").map(Number);

              return (
                <div
                  key={`${dayIdx}-${time}`}
                  className="bg-white border-t border-l min-h-[60px] relative hover:bg-[#cfa491]/10 transition-colors cursor-pointer"
                  onClick={() => onDateSelect(date)}
                >
                  {/* Render events that start in this hour */}
                  {dayEvents
                    .filter((event) => {
                      const [startHour] = event.startDate
                        .split("T")[1]
                        .split(":")
                        .map(Number);
                      return startHour === hour;
                    })
                    .map((event, eventIdx) => {
                      const eventColor = event.color
                        ? event.color
                        : getColorByLabel(event.category1Id);
                      const position = getEventPosition(event);
                      return (
                        <div
                          key={event.id}
                          className="absolute left-0 right-0 mx-1 px-2 py-1 rounded text-xs overflow-hidden"
                          style={{
                            ...position,
                            backgroundColor: `${hexToRgba(eventColor, 0.2)}`,
                            borderLeft: `3px solid ${eventColor}`,
                            zIndex: 10 + eventIdx,
                          }}
                        >
                          <div
                            className="truncate"
                            style={{
                              color: eventColor,
                            }}
                          >
                            {event.title}
                          </div>
                          <div className="text-[10px] opacity-70">
                            {formatTime(event.startDate)}-
                            {formatTime(event.endDate)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
