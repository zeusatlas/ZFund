"use client";

import { format } from "date-fns";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { formatMoney } from "@/lib/format";
import { useUpdateWithdrawalStatus, type Withdrawal } from "../admin-api";
import { actionLabel, methodLabel, nextStatuses, WithdrawalStatusBadge } from "./withdrawal-status";

const buttonStyle = {
  PROCESSING: "border border-navy/15 bg-white text-navy hover:bg-stone",
  DONE: "bg-navy text-white hover:bg-steel",
  REJECTED: "border border-crimson/25 bg-white text-crimson hover:bg-danger-soft",
} as const;

export default function WithdrawalDetailsModal({ withdrawal, onClose }: Readonly<{ withdrawal: Withdrawal; onClose: () => void }>) {
  const update = useUpdateWithdrawalStatus();
  const [note, setNote] = useState("");
  const actions = nextStatuses[withdrawal.status];

  const rows: [string, string][] = [
    ["Host", `${withdrawal.hostName} (${withdrawal.hostEmail})`],
    ["Campaign", withdrawal.projectName ?? "Not linked to a campaign"],
    ["Requested", format(new Date(withdrawal.createdAt), "MMM d, yyyy, HH:mm")],
    ["Method", `${methodLabel[withdrawal.method]} · ${withdrawal.institution}`],
    ["Recipient", withdrawal.recipientName],
    ["Account number", withdrawal.accountNumber],
  ];

  return (
    <Modal
      eyebrow={withdrawal.reference}
      title="Withdrawal request"
      onClose={onClose}
      footer={
        actions.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-2">
            {actions.map((status) => (
              <button
                key={status}
                type="button"
                disabled={update.isPending}
                onClick={() => update.mutate({ id: withdrawal.id, status, note }, { onSuccess: onClose })}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-60 ${buttonStyle[status]}`}
              >
                {actionLabel[status]}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-steel hover:bg-stone">
              Close
            </button>
          </div>
        )
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-steel">Amount</p>
          <p className="mt-1 text-2xl font-semibold text-navy">{formatMoney(withdrawal.amount)}</p>
        </div>
        <WithdrawalStatusBadge status={withdrawal.status} />
      </div>

      <dl className="mt-4 divide-y divide-navy/10 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-2.5">
            <dt className="shrink-0 text-steel">{label}</dt>
            <dd className="text-right font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-steel">Purpose</p>
        <p className="mt-1 text-sm text-ink">{withdrawal.purpose}</p>
      </div>

      {withdrawal.reviewedAt && (
        <div className="mt-4 rounded-lg bg-stone-light p-3 text-sm">
          <p className="text-xs text-steel">
            Last updated by {withdrawal.reviewedByName ?? "an administrator"} on {format(new Date(withdrawal.reviewedAt), "MMM d, yyyy, HH:mm")}
          </p>
          {withdrawal.reviewNote && <p className="mt-1 text-ink">{withdrawal.reviewNote}</p>}
        </div>
      )}

      {actions.length > 0 && (
        <label className="mt-5 block text-sm font-medium text-ink">
          Note <span className="font-normal text-steel">(optional, saved with the update)</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={500}
            rows={2}
            placeholder="e.g. Paid via MTN MoMo, reference 12345"
            className="field mt-1.5"
          />
        </label>
      )}
    </Modal>
  );
}
