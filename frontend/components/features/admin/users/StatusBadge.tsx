import type { HostStatus } from "../dashboard/types";

const styles: Record<HostStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-success-soft text-success" },
  PENDING_VERIFICATION: { label: "Pending", className: "bg-warning-soft text-warning" },
  SUSPENDED: { label: "Suspended", className: "bg-danger-soft text-crimson" },
};

export default function StatusBadge({ status }: { status: HostStatus }) {
  const { label, className } = styles[status] ?? styles.PENDING_VERIFICATION;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
