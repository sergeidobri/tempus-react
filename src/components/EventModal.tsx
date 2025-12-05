import { X } from "lucide-react";
import { useRef } from "react";
import CreateTaskForm, {
  type CreateTaskFormHandle,
} from "@/features/tasks/components/CreateTaskForm";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventModal({ isOpen, onClose }: EventModalProps) {
  const formRef = useRef<CreateTaskFormHandle>(null);
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
          <h2 className="text-[#4A403A]">Создать событие</h2>
          <button
            onClick={() => {
              handleModalClose();
            }}
            className="p-1 hover:bg-[#FFE3C7] rounded-lg transition-colors"
          >
            <X size={20} className="text-[#4A403A]" />
          </button>
        </div>

        <CreateTaskForm onClose={onClose} ref={formRef} />
      </div>
    </div>
  );
}
