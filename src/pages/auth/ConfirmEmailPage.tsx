import { useEffect, useRef, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { authApi } from "@/api/auth/api";
import { navigate } from "@/utils/navigate";
import { Route as loginRoute } from "@/routes/auth/login";

const ConfirmEmailPage = () => {
  const search = useSearch({ strict: false });
  const hasProcessed = useRef(false);

  useEffect(() => {
    const confirmEmail = async () => {
      // Защита от двойного вызова в Strict Mode
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const token = search.token;

      if (!token) {
        toast.error("The token is absent");
        navigate(loginRoute.to);
        return;
      }

      try {
        const response = await authApi.confirmEmail({ token });
        if (response.status === 200) {
          toast.success("Адрес электронной почты был успешно подтвержден!");
        } else {
          toast.error(
            "Возникла неизвестная ошибка во время подтверждения почты"
          );
        }
      } catch (error: any) {
        if (error.response?.status >= 400 && error.response?.status < 500) {
          toast.error("Ссылка устарела или недействительна");
        } else {
          toast.error("Возникла ошибка во время подтверждения почты");
        }
      } finally {
        navigate(loginRoute.to);
      }
    };

    confirmEmail();
  }, [search, navigate]);

  return <div>Подтверждение...</div>;
};

export default ConfirmEmailPage;
