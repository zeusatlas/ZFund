import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  detail?: string;
  icon: LucideIcon;
  accent: "green" | "blue" | "gold" | "purple";
};

/** Accent tints are derived from the RaiseFundz palette, not arbitrary colors. */
const accents = {
  green: "bg-lime/20 text-lime-dark",
  blue: "bg-navy/10 text-navy",
  gold: "bg-gold/15 text-gold",
  purple: "bg-steel/10 text-steel",
};

export default function MetricCard({ label, value, detail, icon: Icon, accent }: MetricCardProps) {
  return (
    <article className="group surface-card p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-steel">{label}</p>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${accents[accent]}`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-[1.75rem] font-semibold leading-none tracking-tight text-navy">
        {value}
      </p>
      {detail && <p className="mt-2.5 text-xs leading-relaxed text-steel">{detail}</p>}
    </article>
  );
}
