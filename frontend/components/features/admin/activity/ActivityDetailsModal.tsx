"use client";

import { format } from "date-fns";
import Modal from "@/components/ui/Modal";
import { formatMoney } from "@/lib/format";
import type { ActivityLogEntry } from "../admin-api";

const humanize = (code: string) => {
  const text = code.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const display = (value: unknown) => (typeof value === "object" && value !== null ? JSON.stringify(value) : String(value));

function Values({ title, values }: Readonly<{ title: string; values?: Record<string, unknown> }>) {
  const entries = Object.entries(values ?? {});
  if (entries.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-steel">{title}</h3>
      <dl className="mt-2 divide-y divide-navy/10 rounded-lg border border-navy/10 text-sm">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between gap-4 px-3 py-2.5">
            <dt className="text-steel">{humanize(key.replace(/([A-Z])/g, "_$1"))}</dt>
            <dd className="min-w-0 break-words text-right font-medium text-ink">{display(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ActivityDetailsModal({ entry, onClose }: Readonly<{ entry: ActivityLogEntry; onClose: () => void }>) {
  const rows: [string, string][] = [
    ["Event", humanize(entry.action)],
    ["Record type", humanize(entry.entityType)],
    ...(entry.entityId ? ([["Record ID", entry.entityId]] as [string, string][]) : []),
    ["Performed by", entry.actorName ?? "System"],
    ...(entry.amount ? ([["Amount", formatMoney(entry.amount)]] as [string, string][]) : []),
    ["When", format(new Date(entry.createdAt), "MMM d, yyyy, HH:mm:ss")],
    ...(entry.ipAddress ? ([["IP address", entry.ipAddress]] as [string, string][]) : []),
    ...(entry.userAgent ? ([["Device", entry.userAgent]] as [string, string][]) : []),
  ];

  return (
    <Modal
      eyebrow="Activity log"
      title={humanize(entry.action)}
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-steel hover:bg-stone">Close</button>
        </div>
      }
    >
      <div className="space-y-5">
        <dl className="divide-y divide-navy/10 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3">
              <dt className="shrink-0 text-steel">{label}</dt>
              <dd className="min-w-0 break-words text-right font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <Values title="Before" values={entry.oldValues} />
        <Values title="After" values={entry.newValues} />
      </div>
    </Modal>
  );
}
