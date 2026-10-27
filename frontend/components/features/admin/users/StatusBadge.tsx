import type { HostStatus } from "../dashboard/types";

const styles: Record<HostStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-[#e9f4ef] text-[#287754]" },
  PENDING_VERIFICATION: { label: "Pending", className: "bg-[#fff4dc] text-[#a26c12]" },
  SUSPENDED: { label: "Suspended", className: "bg-[#fbeaea] text-[#a13d3d]" },
};

export default function StatusBadge({ status }: { status: HostStatus }) {
  const { label, className } = styles[status] ?? styles.PENDING_VERIFICATION;
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{label}</span>;
}
