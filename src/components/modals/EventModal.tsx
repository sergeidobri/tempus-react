import { X } from "lucide-react";
import { useRef } from "react";
import TaskForm, {
  type TaskFormHandle,
} from "@/features/tasks/components/TaskForm";
import type { EventModalMode } from "@/store/eventModalStore";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: EventModalMode;
  taskId: string | null; // только для edit
}

export function EventModal({ isOpen, onClose, mode, taskId }: EventModalProps) {
  const formRef = useRef<TaskFormHandle>(null);
  const handleModalClose = () => {
    formRef.current?.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => {
        handleModalClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 flex max-h-[90vh] flex-col"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center flex-shrink-0 justify-between mb-6">
          <h2 className="text-[#4A403A]">
            {mode === "create" ? "Создать событие" : "Редактировать событие"}
          </h2>
          <button
            onClick={() => {
              handleModalClose();
            }}
            className="p-1 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <X size={20} className="text-[#4A403A]" />
          </button>
        </div>

        <TaskForm onClose={onClose} ref={formRef} mode={mode} taskId={taskId} />
      </div>
    </div>
  );
}
