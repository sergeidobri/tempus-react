import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("Некорректный email"),
    firstName: z.string().min(1, "Требуется имя"),
    lastName: z.string().min(1, "Требуется фамилия"),
    password: z
      .string()
      .min(1, "Требуется пароль")
      .min(8, "Пароль должен иметь минимум 8 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
