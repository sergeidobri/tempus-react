import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
} from "@/features/auth/schemas/registerSchema";
import { authApi } from "@/api/auth/api";
import { navigate } from "@/utils/navigate";
import { AxiosError } from "axios";

export const useRegisterForm = () => {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authApi.register({
        email: data.email,
        password: data.password,
        firstName: "User",
        lastName: "1337",
      });
      navigate("/auth/confirm-email-sent");
    } catch (error) {
      let message = "Неправильный логин или пароль";

      if (error instanceof AxiosError) {
        message =
          error.response?.data?.message || "Неправильный логин или пароль";
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const err = error as { response?: { data?: { message?: string } } };
        message =
          err.response?.data?.message || "Неправильный логин или пароль";
      }
      form.setError("root", { message });
    }
  };

  return {
    ...form,
    onSubmit,
  };
};
