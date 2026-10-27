import Link from "next/link";
import { Check, ChevronRight, CircleDollarSign, Clock3 } from "lucide-react";
import { recentActivity } from "./data";

export function RecentActivity() {
  return (
    <article className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-navy">Recent activity</h2>
          <p className="mt-1 text-sm text-steel">
            Latest events requiring your attention
          </p>
        </div>
        <Link
          href="/admin/activity"
          className="text-xs font-medium text-gold hover:text-navy"
        >
          View all
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {recentActivity.slice(0, 3).map((item) => {
          const icon =
            item.tone === "warning" ? (
              <Clock3 size={14} />
            ) : item.tone === "success" ? (
              <CircleDollarSign size={14} />
            ) : (
              <Check size={14} />
            );

          const iconStyle =
            item.tone === "success"
              ? "bg-[#e9f4ef] text-[#287754]"
              : item.tone === "warning"
                ? "bg-[#fff4dc] text-[#a26c12]"
                : "bg-[#eaf0f8] text-[#315b8a]";

          return (
            <div key={item.id} className="flex gap-3">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconStyle}`}
              >
                {icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <span className="shrink-0 text-[11px] text-steel">{item.time}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-steel">
                  {item.description}
                </p>
                {item.amount && (
                  <p className="mt-1 text-xs font-semibold text-[#287754]">
                    {item.amount}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/admin/activity"
        className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-gold hover:text-navy"
      >
        Open activity log
        <ChevronRight size={14} />
      </Link>
    </article>
  );
}
