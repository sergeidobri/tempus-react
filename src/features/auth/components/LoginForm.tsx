import LoginSVG from "@/assets/svg/login.svg";
import PasswordSVG from "@/assets/svg/password.svg";
import { Input } from "@/components/ui/Input";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    onSubmit,
  } = useLoginForm();

  return (
    <form
      className="flex gap-[40px] flex-col"
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
          />
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
            error={errors.password?.message || errors.root?.message}
            disabled={isSubmitting}
          />
          <div className="absolute z-2 left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
        className="mt-1 w-full py-3 bg-[#CFA492] text-white rounded-lg font-medium hover:bg-[#C09786] transition-colors"
      >
        Войти в TEMPUS
      </button>
    </form>
  );
};

export default LoginForm;
