"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

type ModalProps = {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({ title, eyebrow, onClose, children, footer }: Readonly<ModalProps>) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/45 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-navy/10 p-5 sm:p-6">
          <div>
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{eyebrow}</p>}
            <h2 className="mt-1 text-xl font-semibold text-navy">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-steel hover:bg-stone">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
        {footer && <div className="border-t border-navy/10 bg-stone-light p-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
}
