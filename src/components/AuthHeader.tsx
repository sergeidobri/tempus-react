import logo from "@/assets/logo.svg";
import { Link } from "@tanstack/react-router";
import { Route as mainRoute } from "@/routes/index";

export function AuthHeader() {
  return (
    <header className="bg-white border-b border-[#FFE3C7] shadow-sm">
      <div className="flex flex-row max-sm:flex-col max-sm:gap-[15px] max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to={mainRoute.to}>
          <div className="flex w-[320px] justify-center">
            {/* <h1 className="text-[#CFA492] tracking-wider"></h1> */}
            <img src={logo} alt="TEMPUS" />
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="flex gap-[10px] relative">
            <Link to="/auth/login">
              <div className="p-[10px] bg-[#CFA492] hover:bg-[#C09786] rounded-[15px] text-white">
                Войти
              </div>
            </Link>
            <Link to="/auth/register">
              <div className="p-[10px] border border-[#CFA492] hover:bg-[#FFF5F2] rounded-[15px]">
                Регистрация
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
