import { useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { authApi } from "@/api/auth/api";
import { navigate } from "@/utils/navigate";
import { Route as loginRoute } from "@/routes/auth/login";

const ConfirmEmailPage = () => {
  const search = useSearch({ strict: false });

  useEffect(() => {
    const confirmEmail = async () => {
      const token = search.token;

      if (!token) {
        toast.error("The token is absent");
        navigate(loginRoute.to);
        return;
      }

      try {
        const response = await authApi.confirmEmail({ token });
        if (response.status === 200) {
          toast.success("The email was successfully confirmed!");
        } else {
          toast.error("Unknown error while confirming email.");
        }
      } catch (error: any) {
        if (error.response?.status >= 400 && error.response?.status < 500) {
          toast.error("Error while confirming. The link is expired or invalid");
        } else {
          toast.error("An error occured while confirming an email.");
        }
      } finally {
        navigate(loginRoute.to);
      }
    };

    confirmEmail();
  }, [search, navigate]);

  return <div>Confirming...</div>;
};

export default ConfirmEmailPage;
