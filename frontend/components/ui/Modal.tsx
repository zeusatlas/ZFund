"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

type ModalProps = {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  className?: string;
};

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export default function Modal({
  title,
  eyebrow,
  onClose,
  children,
  footer,
  size = "2xl",
  className,
}: Readonly<ModalProps>) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-midnight/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-[calc(100vh-2rem)] w-full ${SIZE_CLASSES[size] ?? "max-w-2xl"} flex-col overflow-hidden rounded-0 bg-white shadow-2xl ${className ?? ""}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-navy/10 px-5 py-4 sm:px-6 sm:py-5">
          <div>
            {eyebrow && <p className="text-eyebrow text-gold">{eyebrow}</p>}
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-navy sm:text-xl">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-steel transition-colors hover:bg-stone hover:text-navy"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <div className="border-t border-navy/10 bg-stone-light px-5 py-3.5 sm:px-6">{footer}</div>
        )}
      </div>
    </div>
  );
}
