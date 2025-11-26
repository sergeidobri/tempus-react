import { useState } from "react";
import { MiniCalendar } from "./components/MiniCalendar";
import { MonthCalendar } from "./components/MonthCalendar";
import { WeekCalendar } from "./components/WeekCalendar";
import { DayCalendar } from "./components/DayCalendar";
import { DailySchedule } from "./components/DailySchedule";
import type { CalendarEvent } from "./utils/calendar";
import { EventModal } from "./components/EventModal";
import { MainHeader } from "./components/MainHeader";

export type ViewMode = "day" | "week" | "month";

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Погулять с собакой",
      date: new Date(2025, 9, 5),
      startTime: "9:00",
      endTime: "9:30",
      category: "Развлечения",
    },
    {
      id: "2",
      title: "Продолжить изучение линейной алгебры",
      date: new Date(2025, 9, 5),
      startTime: "11:00",
      endTime: "12:30",
      category: "Образование",
    },
    {
      id: "3",
      title: "Свидание с Кларой",
      date: new Date(2025, 9, 5),
      startTime: "12:00",
      endTime: "14:00",
      category: "Встречи",
    },
    {
      id: "4",
      title: "Встреча с коллегами",
      date: new Date(2025, 9, 1),
      startTime: "10:00",
      endTime: "11:00",
      category: "Встречи",
    },
    {
      id: "5",
      title: "Подготовка презентации",
      date: new Date(2025, 9, 17),
      startTime: "14:00",
      endTime: "16:00",
      category: "Работа",
    },
    {
      id: "6",
      title: "Йога",
      date: new Date(2025, 9, 17),
      startTime: "18:00",
      endTime: "19:30",
      category: "Хобби",
    },
  ]); // подгружается с бэка в лоадере, не тут

  const [currentDateSmallCalendar, setCurrentDateSmallCalendar] = useState(
    new Date()
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const handleCreateEvent = (eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents([...events, newEvent]);
  };

  return (
    <>
      <MainHeader onCreateEvent={() => setIsModalOpen(true)} />

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

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateEvent}
        initialDate={selectedDate}
      />
    </>
  );
}
