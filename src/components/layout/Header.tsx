import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.svg";
import { Route as mainRoute } from "@/routes/index";
import { MainHeader } from "./MainHeader";
import { useAuthStore } from "@/store/authStore";
import { AuthHeader } from "./AuthHeader";

interface HeaderProps {
  onCreateEvent: () => void;
}

export function Header({ onCreateEvent }: HeaderProps) {
  const isAuthenticated = useAuthStore().isAuthenticated();

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
          {isAuthenticated ? (
            <MainHeader onCreateEvent={onCreateEvent} />
          ) : (
            <AuthHeader />
          )}
        </div>
      </div>
    </header>
  );
}
