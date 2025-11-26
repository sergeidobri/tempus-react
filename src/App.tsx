import { useState } from "react";
import { MiniCalendar } from "./components/MiniCalendar";
import { MonthCalendar } from "./components/MonthCalendar";
import { WeekCalendar } from "./components/WeekCalendar";
import { DayCalendar } from "./components/DayCalendar";
import { DailySchedule } from "./components/DailySchedule";
import { tasksApi } from "./api/tasks/api";
import { useQuery } from "@tanstack/react-query";

export type ViewMode = "day" | "week" | "month";

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    data: events,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.get,
  });

  const [currentDateSmallCalendar, setCurrentDateSmallCalendar] = useState(
    new Date()
  );

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const getViewMode = () => viewMode;

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleSmallCalendarMonthChange = (increment: number) => {
    const newDate = new Date(currentDateSmallCalendar);
    newDate.setMonth(currentDateSmallCalendar.getMonth() + increment);
    setCurrentDateSmallCalendar(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(new Date(date));
  };

  const handleWeekChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleDayChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
    setCurrentDate(newDate);
  };
  // const handleCreateEvent = (eventData: Omit<CalendarEvent, "id">) => {
  //   const newEvent: CalendarEvent = {
  //     ...eventData,
  //     id: Date.now().toString(),
  //   };
  //   setEvents([...events, newEvent]);
  // };
  if (isPending) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <>
      {/* Main Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Left Column - Mini Calendar & Schedule */}
          <div className="space-y-6">
            <MiniCalendar
              currentDate={currentDateSmallCalendar}
              selectedDate={selectedDate}
              events={events}
              onDateSelect={handleDateSelect}
              onMonthChange={handleSmallCalendarMonthChange}
            />

            <DailySchedule selectedDate={selectedDate} events={events} />
          </div>

          {/* Right Column - Main Calendar */}
          <div className="space-y-4">
            {/* Calendar View */}
            {viewMode === "month" && (
              <MonthCalendar
                currentDate={currentDate}
                selectedDate={selectedDate}
                events={events}
                onDateSelect={handleDateSelect}
                onMonthChange={handleMonthChange}
                setViewMode={setViewMode}
                getViewMode={getViewMode}
              />
            )}

            {viewMode === "week" && (
              <WeekCalendar
                currentDate={currentDate}
                selectedDate={selectedDate}
                events={events}
                onDateSelect={handleDateSelect}
                onWeekChange={handleWeekChange}
                setViewMode={setViewMode}
                getViewMode={getViewMode}
              />
            )}

            {viewMode === "day" && (
              <DayCalendar
                selectedDate={selectedDate}
                events={events}
                onDateChange={handleDayChange}
                setViewMode={setViewMode}
                getViewMode={getViewMode}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
