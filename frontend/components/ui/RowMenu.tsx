"use client";

import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type RowMenuItem = { label: string; onSelect: () => void; danger?: boolean };

const MENU_WIDTH = 176;

/**
 * Actions menu for a table row. The menu is rendered in a portal with fixed
 * positioning, so it is never clipped by the table's scroll container.
 */
export default function RowMenu({ label, items }: { label: string; items: RowMenuItem[] }) {
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

  function toggle() {
    if (position) return setPosition(null);
    const rect = button.current!.getBoundingClientRect();
    const height = items.length * 36 + 8;
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
        className="rounded-md p-1.5 text-steel hover:bg-stone"
      >
        <MoreHorizontal size={17} />
      </button>
      {position &&
        createPortal(
          <div
            ref={menu}
            role="menu"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-50 rounded-lg border border-navy/10 bg-white py-1 text-left shadow-lg"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setPosition(null);
                  item.onSelect();
                }}
                className={`block w-full px-3 py-2 text-left text-xs hover:bg-stone ${item.danger ? "text-crimson" : "text-ink"}`}
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
