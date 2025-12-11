import { useState } from "react";
import { MiniCalendar } from "./components/layout/MiniCalendar";
import { DayCalendar } from "./components/layout/modes/DayCalendar";
import { DailySchedule } from "./components/layout/DailySchedule";
import { tasksApi } from "./api/tasks/api";
import { useQuery } from "@tanstack/react-query";
import { MonthCalendar } from "./components/layout/modes/MonthCalendar";
import { WeekCalendar } from "./components/layout/modes/WeekCalendar";

export type ViewMode = "day" | "week" | "month";

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data, isPending, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.get,
    structuralSharing: false,
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

  if (isPending) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      {/* Main Content */}
      <div className="relative w-full z-10 max-w-[1400px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Left Column - Mini Calendar & Schedule */}
          <div className="space-y-6">
            <MiniCalendar
              currentDate={currentDateSmallCalendar}
              selectedDate={selectedDate}
              events={data.tasks}
              onDateSelect={handleDateSelect}
              onMonthChange={handleSmallCalendarMonthChange}
            />

            <DailySchedule selectedDate={selectedDate} events={data.tasks} />
          </div>

          {/* Right Column - Main Calendar */}
          <div className="space-y-4 hidden lg:block">
            {/* Calendar View */}
            {viewMode === "month" && (
              <MonthCalendar
                currentDate={currentDate}
                selectedDate={selectedDate}
                events={data.tasks}
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
                events={data.tasks}
                onDateSelect={handleDateSelect}
                onWeekChange={handleWeekChange}
                setViewMode={setViewMode}
                getViewMode={getViewMode}
              />
            )}

            {viewMode === "day" && (
              <DayCalendar
                selectedDate={selectedDate}
                events={data.tasks}
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
