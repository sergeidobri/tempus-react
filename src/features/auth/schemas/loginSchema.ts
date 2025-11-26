import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Некорректный email"),
  password: z
    .string()
    .min(1, "Требуется пароль")
    .min(8, "Пароль должен иметь минимум 8 символов"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
