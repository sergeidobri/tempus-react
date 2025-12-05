import type { TaskViewModel } from "@/types/tasks";
import {
  getEventsForDay,
  formatDate,
  isToday,
  formatTimeFromString as formatTime,
  getColorByLabel,
} from "../utils/calendar";
import { Sun } from "lucide-react";
import { PreviewFloatingTask } from "@/features/tasks/components/PreviewFloatingTask";

interface DailyScheduleProps {
  selectedDate: Date;
  events: TaskViewModel[];
  onEventClick?: (event: TaskViewModel) => void;
}

export function DailySchedule({
  selectedDate,
  events,
  onEventClick,
}: DailyScheduleProps) {
  const dayEvents = getEventsForDay(events, selectedDate);
  const isTodayDate = isToday(selectedDate);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-[#FFE3C7]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#4A403A]">Расписание</h3>
        <div className="flex items-center gap-1 text-sm text-[#4A403A]">
          <Sun size={16} className="text-[#CFA492]" />
          <span>15°/4°</span>
        </div>
      </div>

      {/* Date */}
      <div className="mb-4">
        <p className="text-sm text-[#4A403A]">
          {isTodayDate ? "Сегодня, " : ""}
          {formatDate(selectedDate)}
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {dayEvents.length === 0 ? (
          <p className="text-sm text-[#4A403A]/50 text-center py-8">
            Нет событий на этот день
          </p>
        ) : (
          dayEvents.map((event, index) => {
            const eventColor = event.color
              ? event.color
              : getColorByLabel(event.category1Id);
            return (
              <PreviewFloatingTask key={index} taskId={event.id}>
                <button
                  onClick={() => onEventClick?.(event)}
                  className="w-full text-left p-3 rounded-lg hover:bg-[#FFF5EB] transition-colors border border-transparent hover:border-[#FFE3C7]"
                >
                  <div className="flex items-start gap-3">
                    {/* Time */}
                    <div className="text-[#4A403A] min-w-[3rem]">
                      {formatTime(event.startDate)}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: eventColor,
                          }}
                        />
                        <p className="text-[#4A403A]">{event.title}</p>
                      </div>
                      <p className="text-xs text-[#4A403A]/60">
                        {formatTime(event.startDate)}-
                        {formatTime(event.endDate)}
                      </p>
                      {event.address && (
                        <p className="text-xs text-[#4A403A]/60 mt-1">
                          📍 {event.address}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </PreviewFloatingTask>
            );
          })
        )}
      </div>
    </div>
  );
}
