import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("Некорректный email"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
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
