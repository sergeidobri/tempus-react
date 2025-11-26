import { EventModal } from "@/components/EventModal";
import { Header } from "@/components/layout/Header";
import { setNavigate } from "@/utils/navigate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const RootLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate((path: string) => navigate({ to: path }));
  }, [navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen bg-[#FFF5EB]">
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
        <Header onCreateEvent={() => setIsModalOpen(true)} />
        <Outlet />
        <TanStackRouterDevtools />

        {/* Event Modal */}
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {}} // пока ивенты не сохраняются, потому что нет рута POST /api/tasks
          initialDate={new Date()}
        />
      </div>
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
