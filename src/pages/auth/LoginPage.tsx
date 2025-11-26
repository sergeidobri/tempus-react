import tempusPhoto from "@/assets/main.jpg";

import { Link } from "@tanstack/react-router";
import { Route as registerRoute } from "@/routes/auth/register";
import LoginForm from "@/features/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex w-full flex-1 justify-center items-center p-[1rem]">
      <div className="bg-white relative rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Side - Image */}
        <div className="md:w-1/2 relative hidden md:block">
          <img
            src={tempusPhoto}
            alt="TEMPUS Logo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0"></div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-8 text-center">
            Вход
          </h2>

          <LoginForm />

          {/* Create Account Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Нет аккаунта?{" "}
            <Link
              to={registerRoute.to}
              className="text-[#CFA492] hover:text-[#C09786] font-medium"
            >
              Создать аккаунт
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
