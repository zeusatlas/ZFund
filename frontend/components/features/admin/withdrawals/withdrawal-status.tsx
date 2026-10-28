import type { WithdrawalStatus } from "../admin-api";

type Next = Exclude<WithdrawalStatus, "PENDING">;

export const withdrawalStatus: Record<WithdrawalStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-[#fff4dc] text-[#8b5d0d]" },
  PROCESSING: { label: "Processing", className: "bg-[#eaf0f8] text-[#315b8a]" },
  DONE: { label: "Done", className: "bg-[#e9f4ef] text-[#216746]" },
  REJECTED: { label: "Rejected", className: "bg-[#fbeaea] text-[#a13d3d]" },
};

/** What an admin can do next; DONE and REJECTED are final (mirrors the backend rules). */
export const nextStatuses: Record<WithdrawalStatus, Next[]> = {
  PENDING: ["PROCESSING", "DONE", "REJECTED"],
  PROCESSING: ["DONE", "REJECTED"],
  DONE: [],
  REJECTED: [],
};

export const actionLabel: Record<Next, string> = {
  PROCESSING: "Move to processing",
  DONE: "Mark as done",
  REJECTED: "Reject request",
};

export function WithdrawalStatusBadge({ status }: Readonly<{ status: WithdrawalStatus }>) {
  const { label, className } = withdrawalStatus[status];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{label}</span>;
}

export const methodLabel = { MOBILE_MONEY: "Mobile money", BANK_TRANSFER: "Bank transfer" } as const;
