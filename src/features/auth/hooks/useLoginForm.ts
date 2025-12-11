import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "@/features/auth/schemas/loginSchema";
import { authApi } from "@/api/auth/api";
import { useAuthStore } from "@/store/authStore";
import { navigate } from "@/utils/navigate";
import { AxiosError } from "axios";

export const useLoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // validate
    defaultValues: {
      // иначе будут undefined
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      useAuthStore.getState().setAccessToken(response.data.accessToken);

      navigate("/");
    } catch (error) {
      let message = "Неправильный логин или пароль";

      if (error instanceof AxiosError) {
        message =
          error.response?.data?.message || "Неправильный логин или пароль";
      }
      else if (
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
