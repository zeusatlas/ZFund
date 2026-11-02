const styles: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-[#e9f4ef] text-[#287754]" },
  SCHEDULED: { label: "Upcoming", className: "bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]" },
  PENDING_REVIEW: { label: "Pending Review", className: "bg-[#fff4dc] text-[#a26c12] border border-[#f0d696]/60" },
  REJECTED: { label: "Rejected", className: "bg-[#fbeaea] text-[#a13d3d] border border-crimson/20" },
  DRAFT: { label: "Draft", className: "bg-stone text-steel" },
  SUSPENDED: { label: "Suspended", className: "bg-[#fbeaea] text-[#a13d3d]" },
  COMPLETED: { label: "Completed", className: "bg-[#eaf0f8] text-[#234d79]" },
  ARCHIVED: { label: "Archived", className: "bg-stone text-steel" },
};

const LIVE_STATUSES = ["PUBLISHED", "APPROVED", "SCHEDULED"];

/**
 * Live campaigns (published/approved/scheduled) are shown by their dates:
 * Completed once the end date has passed, Upcoming before the start date, otherwise Active.
 */
function displayStatus(status: string, startDate?: string | null, endDate?: string | null) {
  if (!LIVE_STATUSES.includes(status)) return status;
  const now = Date.now();
  if (endDate) {
    const end = new Date(endDate);
    // A date-only end date runs to the end of that day.
    if (end.getUTCHours() + end.getUTCMinutes() + end.getUTCSeconds() === 0) end.setUTCDate(end.getUTCDate() + 1);
    if (end.getTime() <= now) return "COMPLETED";
  }
  if (startDate && new Date(startDate).getTime() > now) return "SCHEDULED";
  return "ACTIVE";
}

export function CampaignStatusBadge({
  status,
  startDate,
  endDate,
}: Readonly<{ status: string; startDate?: string | null; endDate?: string | null }>) {
  const shown = displayStatus(status, startDate, endDate);
  const { label, className } = styles[shown] ?? { label: shown, className: "bg-stone text-steel" };
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
