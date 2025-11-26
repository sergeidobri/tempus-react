import { setNavigate } from "@/utils/navigate";
import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

const RootLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate((path: string) => navigate({ to: path }));
  }, [navigate]);
  return (
    <div className="min-h-screen bg-[#FFF5EB]">
      {/* Custom Background */}
      <div className="fixed z-0 inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-[85vh]"
          viewBox="0 0 1440 766"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M1160.8 765.001H0V11.7449L1160.8 765.001Z"
            fill="#FFE3C7"
            opacity="0.5"
          />
          <path
            d="M1440 766H0V552.341L1440 0V766Z"
            fill="#FFECD9"
            opacity="0.3"
          />
        </svg>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({ component: RootLayout });
