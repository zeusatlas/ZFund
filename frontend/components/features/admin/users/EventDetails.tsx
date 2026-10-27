import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3 } from "lucide-react";
import type { HostAccount } from "../dashboard/data";
import type { UserEvent } from "./user-data";

function EventStatus({ status }: { status: UserEvent["status"] }) {
  const complete = status === "Completed";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
        complete ? "bg-[#e9f4ef] text-[#287754]" : "bg-[#fff4dc] text-[#a26c12]"
      }`}
    >
      {complete ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
      {status}
    </span>
  );
}

export default function EventDetails({
  user,
  event,
}: {
  user: HostAccount;
  event: UserEvent;
}) {
  const status = event.status ?? "Completed";
  const complete = status === "Completed";

  return (
    <div className="w-full max-w-4xl space-y-6">
      <Link
        href={`/dashboard/admin/users/${user.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-steel hover:text-navy"
      >
        <ArrowLeft size={16} />
        Back to {user.name}
      </Link>

      <section className="rounded-xl border border-navy/10 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-navy/10 p-5 md:flex-row md:items-start md:justify-between md:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
              Fund event
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-navy md:text-3xl">
              {event.title}
            </h1>
            <p className="mt-2 text-sm text-steel">{event.description}</p>
          </div>
          <div className="md:text-right">
            <p className="text-xs uppercase tracking-wide text-steel">Amount</p>
            <p className="mt-1 text-2xl font-semibold text-navy">
              {event.amount ?? "GHS 0.00"}
            </p>
            <div className="mt-3 md:flex md:justify-end">
              <EventStatus status={status} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-2 md:p-7">
          <div>
            <h2 className="text-sm font-semibold text-navy">Event information</h2>
            <dl className="mt-4 divide-y divide-navy/10 text-sm">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-steel">Host</dt>
                <dd className="text-right font-medium text-ink">{user.name}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-steel">Created</dt>
                <dd className="text-right font-medium text-ink">{event.date}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-steel">Current state</dt>
                <dd className="text-right font-medium text-ink">{status}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-navy">Progress</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone text-navy">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">Event created</p>
                  <p className="mt-0.5 text-xs text-steel">{event.date}</p>
                </div>
              </div>
              <div className="ml-4 h-5 border-l border-navy/15" />
              <div className="flex items-start gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${complete ? "bg-stone text-navy" : "bg-[#fff4dc] text-[#a26c12]"}`}>
                  {complete ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">
                    {complete ? "Event completed" : "Event in progress"}
                  </p>
                  <p className="mt-0.5 text-xs text-steel">
                    {complete ? "This event has ended" : "This event has not ended"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
