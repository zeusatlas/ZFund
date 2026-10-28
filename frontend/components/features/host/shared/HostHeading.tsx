import type { ReactNode } from "react";

export default function HostHeading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-eyebrow mb-2 text-gold">Overview</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{description}</p>
      </div>
      {children}
    </div>
  );
}
