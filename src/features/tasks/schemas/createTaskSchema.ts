import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Требуется название")
    .max(128, "Макс. длина: 128 символов"),
  startDate: z.string().optional(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$|^$/, "Неверный формат времени")
    .nullable()
    .optional(),
  endDate: z.string().optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$|^$/, "Неверный формат времени")
    .nullable()
    .optional(),
  fullDay: z.boolean().default(false).optional(),
  categoryIds: z
    .array(z.object({ categoryId: z.string(), priority: z.number() }))
    .optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#([0-9a-f]{6}|[0-9a-f]{3})$/, "Неверный формат цвета")
    .nullable()
    .optional(),
  shares: z.array(z.string()).optional(),
});

// Валидация: endTime > startTime
export const createTaskSchemaWithTimeCheck = createTaskSchema
  .refine(
    (data) => {
      if (
        data.startDate &&
        data.startTime &&
        data.endDate &&
        data.endTime &&
        !data.fullDay
      ) {
        const startMs = new Date(
          `${data.startDate}T${data.startTime}`
        ).getTime();
        const endMs = new Date(`${data.endDate}T${data.endTime}`).getTime();

        return endMs - startMs > 0;
      }

      return true;
    },
    {
      message: "Некорректное время",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && !data.startTime) return false;
      return true;
    },
    {
      message: "Введите время",
      path: ["startTime"],
    }
  )
  .refine(
    (data) => {
      if (data.endDate && !data.endTime && !data.fullDay) return false;
      return true;
    },
    {
      message: "Введите время",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      if (!data.endDate && data.endTime && !data.fullDay) return false;
      return true;
    },
    {
      message: "Выберите дату",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      if (!data.startDate && data.startTime) return false;
      return true;
    },
    {
      message: "Выберите дату",
      path: ["startTime"],
    }
  );

export type CreateTaskFormData = z.infer<typeof createTaskSchemaWithTimeCheck>;
