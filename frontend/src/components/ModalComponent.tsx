import { CircleX } from "lucide-react";
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
      <div className="modal modal-open">
        <div className="modal-box">
       
            <span className="grid justify-end text-red-600" onClick={onClose}>
            <CircleX   />
          </span>
          
          <p className="text-3xl">{title}</p>
          <div className="pt-10 ">{content}</div>
        </div>
      </div>
    </>
  );
};
