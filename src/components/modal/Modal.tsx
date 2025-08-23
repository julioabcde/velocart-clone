import React, { useEffect, useRef } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  backdrop?: "dim" | "light" | "blur" | "transparent" | "none";
  children?: React.ReactNode;
}

const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
  <div className="flex items-center justify-between border-b p-4">
    <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close modal">✕</button>
  </div>
);

const ModalBody: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="p-4">{children}</div>
);

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm:  "sm:max-w-[360px]",
  md:  "sm:max-w-[480px]",
  lg:  "sm:max-w-[640px]",
  xl:  "sm:max-w-[800px]",
  full:"w-full h-full sm:h-auto sm:max-w-[90vw]",
};

const backdropClasses: Record<NonNullable<ModalProps["backdrop"]>, string> = {
  dim:         "bg-black/50",
  light:       "bg-black/20",
  blur:        "bg-black/10 backdrop-blur-sm",     
  transparent: "bg-transparent",
  none:        "",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = "md",
  backdrop = "blur",         
  children
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 flex items-center justify-center ${backdropClasses[backdrop]}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full max-w-[90vw] rounded-lg bg-white shadow-lg ${sizeClasses[size]}`}
      >
        <ModalHeader title={title} onClose={onClose} />
        <div className="max-h-[85vh] overflow-y-auto">
          <ModalBody>{children}</ModalBody>
        </div>
      </div>
    </div>
  );
};

export default Modal;
