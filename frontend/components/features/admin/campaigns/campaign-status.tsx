const styles: Record<string, { label: string; className: string }> = {
  PUBLISHED: { label: "Published", className: "bg-[#e9f4ef] text-[#287754]" },
  PENDING_REVIEW: { label: "Pending approval", className: "bg-[#fdebd3] text-[#a2530f]" },
  APPROVED: { label: "Approved", className: "bg-[#e9f4ef] text-[#287754]" },
  DRAFT: { label: "Draft", className: "bg-[#fff4dc] text-[#a26c12]" },
  SUSPENDED: { label: "Suspended", className: "bg-[#fbeaea] text-[#a13d3d]" },
};

export function CampaignStatusBadge({ status }: Readonly<{ status: string }>) {
  const { label, className } = styles[status] ?? { label: status, className: "bg-stone text-steel" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{label}</span>;
}

/** Share of the target raised, capped at 100. Null when the campaign has no target. */
export function progressPercent(raised: string, target?: string) {
  const goal = Number(target);
  if (!goal || goal <= 0) return null;
  return Math.min(100, Math.round((Number(raised) / goal) * 100));
}

export function ProgressBar({ percent }: Readonly<{ percent: number }>) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gold" style={{ width: `${percent}%` }} />
    </div>
  );
}
