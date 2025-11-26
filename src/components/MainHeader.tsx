import { Plus, ChevronDown, User, Settings, LogOut } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useState } from "react";
import { Route as mainRoute } from "@/routes/index";
import { Route as logoutRoute } from "@/routes/auth/logout";
import { Link } from "@tanstack/react-router";

interface HeaderProps {
  onCreateEvent: () => void;
}

export function MainHeader({ onCreateEvent }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

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
          {/* Create Event Button */}
          <button
            onClick={onCreateEvent}
            className="flex items-center gap-2 px-4 py-2 bg-[#CFA492] text-white rounded-full hover:bg-[#B88976] transition-colors"
          >
            <Plus size={18} />
            <span>Создать событие</span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 hover:bg-[#FFF5EB] rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#FFE3C7] flex items-center justify-center">
                <User size={20} className="text-[#CFA492]" />
              </div>
              <ChevronDown size={16} className="text-[#4A403A]" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#FFE3C7] py-2 z-20">
                  <button className="w-full px-4 py-2 text-left text-sm text-[#4A403A] hover:bg-[#FFF5EB] flex items-center gap-2">
                    <User size={16} />
                    Профиль
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-[#4A403A] hover:bg-[#FFF5EB] flex items-center gap-2">
                    <Settings size={16} />
                    Настройки
                  </button>
                  <div className="border-t border-[#FFE3C7] my-2" />
                  <Link to={logoutRoute.to}>
                    <button className="w-full px-4 py-2 text-left text-sm text-[#4A403A] hover:bg-[#FFF5EB] flex items-center gap-2">
                      <LogOut size={16} />
                      Выйти
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
