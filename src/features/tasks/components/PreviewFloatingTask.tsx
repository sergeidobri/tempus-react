import { tasksApi } from "@/api/tasks/api";
import PreviewContent from "@/components/PreviewContent";
import {
  useFloating,
  useClick,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const PreviewFloatingTask = ({
  taskId,
  children,
}: {
  taskId: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const {
    data: taskInfo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => tasksApi.getById(taskId),
    staleTime: 5 * 1000 * 60, // 5 минут staleTime
    enabled: open, // грузим только когда поповер открыт
  });

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "right-start",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(), // меняет сторону при нехватке места
      shift(), // сдвигает, чтобы не вылезало за край
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>

      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50 max-w-xs w-80 bg-white shadow-lg rounded-md p-4 border"
        >
          {isLoading && <div className="text-center py-4">Загрузка...</div>}
          {isError && (
            <div className="text-center py-4 text-red-500">
              Ошибка:
              {error instanceof Error ? error.message : "Не удалось загрузить"}
            </div>
          )}
          {taskInfo && <PreviewContent info={taskInfo} />}
        </div>
      )}
    </>
  );
};
