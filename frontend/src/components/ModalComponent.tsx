import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  content: ReactNode;
  onClose(): void;
  open: boolean;
}

export const ModalComponent = ({
  title,
  content,
  onClose,
  open,
}: ModalProps) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Modal Container */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden text-black">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-black">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
              aria-label="Cerrar modal"
            >
              <X className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {content}
          </div>
        </div>
      </div>
    </>
  );
};
