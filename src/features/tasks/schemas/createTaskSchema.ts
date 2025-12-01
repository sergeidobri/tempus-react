import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Требуется название"),
  date: z.string().optional(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Неверный формат времени")
    .nullable()
    .optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Неверный формат времени")
    .nullable()
    .optional(),
  categoryIds: z.array(z.string()).optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#([0-9a-f]{6}|[0-9a-f]{3})$/, "Неверный формат цвета")
    .nullable()
    .optional(),
});

// Валидация: endTime > startTime
export const createTaskSchemaWithTimeCheck = createTaskSchema.refine(
  (data) => {
    if (!data.startTime || !data.endTime) {
      return true;
    }
    const start = data.startTime?.split(":").map(Number);
    const end = data.endTime?.split(":").map(Number);
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    return endMinutes > startMinutes;
  },
  {
    message: "Время окончания должно быть позже начала",
    path: ["endTime"],
  }
);

export type CreateTaskFormData = z.infer<typeof createTaskSchemaWithTimeCheck>;
