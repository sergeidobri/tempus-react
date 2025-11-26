import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
} from "@/features/auth/schemas/registerSchema";
import { authApi } from "@/api/auth/api";
import { navigate } from "@/utils/navigate";

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
        firstName: data.firstName,
        lastName: data.lastName,
      });

      navigate("/auth/confirm-email-sent");
    } catch (error: any) {
      const message = error.response?.data?.message || "Неудачная авторизация";
      form.setError("root", { message });
    }
  };

  return {
    ...form,
    onSubmit,
  };
};
