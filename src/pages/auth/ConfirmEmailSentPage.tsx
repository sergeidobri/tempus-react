import tempusPhoto from "@/assets/main.jpg";

import { Link } from "@tanstack/react-router";
import { Route as loginRoute } from "@/routes/auth/login";

const ConfirmEmailSentPage = () => {
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
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-start">
          <h2 className="text-xl font-semibold text-gray-800 mb-8 text-center">
            Подтвердите почту
          </h2>

          <p className="text-center mb-8">
            Вам на почту было отправлено письмо для подтверждения
          </p>

          <Link
            to={loginRoute.to}
            className="text-[#CFA492] hover:text-[#C09786] font-medium mt-auto text-center"
          >
            Вернуться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailSentPage;
