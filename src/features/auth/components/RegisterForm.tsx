import LoginSVG from "@/assets/svg/login.svg";
import PasswordSVG from "@/assets/svg/password.svg";
import { Input } from "@/components/ui/Input";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    onSubmit,
  } = useRegisterForm();

  return (
    <form
      className="flex flex-col gap-[35px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Login Field */}
      <div className="relative">
        <div className="relative w-full">
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="w-full pl-10 pr-4 py-3 outline-none bg-transparent placeholder:text-gray-400"
            placeholder="Ваш email"
            error={errors.email?.message}
            disabled={isSubmitting}
          />{" "}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <img src={LoginSVG} alt="Login" className="h-5 w-5" />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#CFA492]"
            style={{
              background:
                "linear-gradient(to right, #CFA492, rgba(207, 164, 146, 0.3))",
            }}
          ></div>
        </div>
      </div>

      {/* Password Field */}
      <div className="relative">
        <div className="relative w-full">
          <Input
            id="password"
            type="password"
            placeholder="Ваш пароль"
            className="w-full pl-10 pr-4 py-3 outline-none bg-transparent placeholder:text-gray-400"
            {...register("password")}
            error={errors.password?.message}
            disabled={isSubmitting}
          />{" "}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <img src={PasswordSVG} alt="Login" className="h-5 w-5" />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#CFA492]"
            style={{
              background:
                "linear-gradient(to right, #CFA492, rgba(207, 164, 146, 0.3))",
            }}
          ></div>
        </div>
      </div>

      {/* Repeat Password Field */}
      <div className="relative">
        <div className="relative w-full">
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Ваш пароль"
            className="w-full pl-10 pr-4 py-3 outline-none bg-transparent placeholder:text-gray-400"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message || errors.root?.message}
            disabled={isSubmitting}
          />{" "}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <img src={PasswordSVG} alt="Login" className="h-5 w-5" />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#CFA492]"
            style={{
              background:
                "linear-gradient(to right, #CFA492, rgba(207, 164, 146, 0.3))",
            }}
          ></div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-[#CFA492] text-white rounded-lg font-medium hover:bg-[#C09786] transition-colors"
      >
        Регистрация
      </button>
    </form>
  );
};

export default RegisterForm;
