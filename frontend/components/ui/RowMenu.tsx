"use client";

import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type RowMenuItem = {
  label: string;
  onSelect: () => void;
  danger?: boolean;
  icon?: ReactNode;
};

const MENU_WIDTH = 176;

/**
 * Actions menu for a table or list row. The menu is rendered in a portal with fixed
 * positioning, so it is never clipped by scroll containers or details elements.
 */
export default function RowMenu({
  label,
  items,
}: {
  label: string;
  items: RowMenuItem[];
}) {
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!position) return;
    const close = () => setPosition(null);
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!menu.current?.contains(target) && !button.current?.contains(target)) close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [position]);

  function toggle(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (position) return setPosition(null);
    const rect = button.current!.getBoundingClientRect();
    const height = items.length * 36 + 12;
    // Flip upward when there is no room below the button.
    const top = rect.bottom + height > window.innerHeight ? rect.top - height - 4 : rect.bottom + 4;
    setPosition({ top, left: Math.max(8, rect.right - MENU_WIDTH) });
  }

  if (items.length === 0) return null;

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={position !== null}
        onClick={toggle}
        className="rounded-lg p-1.5 text-steel transition-colors hover:bg-stone hover:text-navy focus:outline-none focus:ring-1 focus:ring-navy/20"
      >
        <MoreHorizontal size={18} />
      </button>
      {position &&
        createPortal(
          <div
            ref={menu}
            role="menu"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-50 rounded-xl border border-navy/10 bg-white py-1.5 text-left shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPosition(null);
                  item.onSelect();
                }}
                className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-stone ${
                  item.danger ? "text-crimson hover:bg-crimson/5" : "text-navy"
                }`}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
