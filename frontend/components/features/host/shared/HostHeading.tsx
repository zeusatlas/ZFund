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
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-navy md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-steel">{description}</p>
      </div>
      {children}
    </div>
  );
}

