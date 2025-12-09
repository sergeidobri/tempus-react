import type { TaskViewModel } from "@/types/tasks";
import {
  getEventsForDay,
  formatDate,
  isToday,
  formatTimeFromString as formatTime,
  getCategoryColorById,
  getFallBackColor,
} from "../../utils/calendar";
import { Sun } from "lucide-react";
import { PreviewFloatingTask } from "@/features/tasks/components/PreviewFloatingTask";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/api/categories/api";
import { useLocationStore } from "@/store/locationStore";
import { weatherApi } from "@/api/weather/api";
import { useEffect, useState } from "react";

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
  const fallbackNumber = -481516;
  const { lat, lon, city } = useLocationStore();
  const [currentTemp, setCurrentTemp] = useState<number>(fallbackNumber);

  const { data, isPending, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });

  const { data: weatherData, isPending: isWeatherPending } = useQuery({
    queryKey: ["weather", lat, lon, selectedDate.toISOString().split("T")[0]],
    queryFn: () => {
      if (lat == null || lon == null) {
        throw new Error("No location");
      }
      return weatherApi.getForecast(lat, lon);
    },
    enabled: lat != null && lon != null,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (!isWeatherPending && weatherData?.current) {
      setCurrentTemp(weatherData.current.temperature_2m);
    }
  }, [weatherData]);

  const dayEvents = getEventsForDay(events, selectedDate);
  const isTodayDate = isToday(selectedDate);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-[#FFE3C7]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#4A403A]">Расписание</h3>
        <div className="flex items-center justify-end gap-2 text-sm text-[#4A403A]">
          <span className="text-end">{city}</span>
          {currentTemp !== fallbackNumber && (
            <span>{Number(currentTemp).toFixed(0)}°C</span>
          )}
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
              : !isPending && !isError
                ? getCategoryColorById(event.category1Id, data.categories)
                : getFallBackColor();
            return (
              <PreviewFloatingTask key={index} taskId={event.taskId}>
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: eventColor,
                          }}
                        />
                        <p className="text-[#4A403A] truncate">{event.title}</p>
                      </div>
                      <p className="text-xs text-[#4A403A]/60">
                        {formatTime(event.startDate)}
                        {event.endDate
                          ? `-${formatTime(event.endDate)}`
                          : ` - весь день`}
                      </p>
                      {event.address && (
                        <p className="text-xs text-[#4A403A]/60 mt-1 break-words">
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
