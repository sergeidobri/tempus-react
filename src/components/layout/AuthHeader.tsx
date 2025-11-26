import { Link } from "@tanstack/react-router";

export function AuthHeader() {
  return (
    <>
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
    </>
  );
}
