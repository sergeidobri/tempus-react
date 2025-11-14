import type { Category } from "@/components/EventModal";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: Category;
  location?: string;
  description?: string;
}

export const EVENT_COLORS = [
  { label: "Образование", color: "#E200B1" },
  { label: "Работа", color: "#008afcff" },
  { label: "Хобби", color: "#00ff55ff" },
  { label: "Здоровье", color: "#e2c000ff" },
  { label: "Спорт", color: "#f180d9ff" },
  { label: "Развлечения", color: "#a50000ff" },
  { label: "Путешествие", color: "#E200B1" },
  { label: "Покупки", color: "#009456ff" },
  { label: "Документы", color: "#bef381ff" },
  { label: "Встречи", color: "#dd6b00ff" },
  { label: "Быт", color: "#683518ff" },
  { label: "Отношения", color: "#0004fcff" },
  { label: "Красота", color: "#25571bff" },
];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  // Returns day of week (0 = Sunday, 1 = Monday, etc.)
  const day = new Date(year, month, 1).getDay();
  // Convert to Monday = 0, Sunday = 6
  return day === 0 ? 6 : day - 1;
}

export function getMonthData(year: number, month: number): (number | null)[][] {
  const daysInMonth = getDaysInMonth(year, month); // получаем кол-во дней
  const firstDay = getFirstDayOfMonth(year, month); // день недели первого дня месяца
  const weeks: (number | null)[][] = [];

  let currentWeek: (number | null)[] = []; // дни прошлого месяца до сегодняшней да

  // Fill in days before the first of the month
  for (let i = 0; i < firstDay; i++) {
    const prevMonthDays = getDaysInMonth(year, month - 1);
    currentWeek.push(prevMonthDays - firstDay + i + 1);
  }

  // Fill in the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill in days after the last of the month
  if (currentWeek.length > 0) {
    let nextDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push(nextDay++);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export function formatDate(date: Date): string {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  return `${date.getDate()} ${months[date.getMonth()]}`;
}

export function formatMonthYear(date: Date): string {
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

  return `${months[date.getMonth()]}, ${date.getFullYear()}`;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getEventsForDay(
  events: CalendarEvent[],
  date: Date
): CalendarEvent[] {
  return events
    .filter((event) => isSameDay(event.date, date))
    .sort((a, b) => {
      const timeA =
        parseInt(a.startTime.split(":")[0]) * 60 +
        parseInt(a.startTime.split(":")[1]);
      const timeB =
        parseInt(b.startTime.split(":")[0]) * 60 +
        parseInt(b.startTime.split(":")[1]);
      return timeA - timeB;
    });
}

export function getDayName(date: Date): string {
  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  return days[date.getDay()];
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return isSameDay(date, today);
}

export function isWeekend(dayIndex: number): boolean {
  // dayIndex: 0 = Monday, 6 = Sunday
  return dayIndex === 5 || dayIndex === 6;
}

export const hexToRgba = (hex: string | undefined, alpha = 0.2) => {
  if (!hex) return ``;
  // Убираем # если есть
  const cleanHex = hex.replace("#", "");
  // Разбиваем на компоненты
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
