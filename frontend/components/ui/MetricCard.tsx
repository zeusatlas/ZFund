import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
  accent: "green" | "blue" | "gold" | "purple";
};

const accents = {
  green: "bg-[#e9f4ef] text-[#216746]",
  blue: "bg-[#eaf0f8] text-[#234d79]",
  gold: "bg-[#fff4dc] text-[#8b5d0d]",
  purple: "bg-[#f1ebf8] text-[#624186]",
};

export default function MetricCard({ label, value, detail, icon: Icon, accent }: MetricCardProps) {
  return (
    <article className={`relative overflow-hidden rounded-xl border border-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accents[accent]}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold opacity-80">{label}</p>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70">
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight">{value}</p>
      {detail && <p className="mt-2 text-xs font-semibold opacity-75">{detail}</p>}
    </article>
  );
}
