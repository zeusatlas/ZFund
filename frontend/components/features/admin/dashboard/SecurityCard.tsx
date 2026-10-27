import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

export function SecurityCard() {
  return (
    <article className="self-start rounded-xl border border-navy/10 bg-navy p-5 text-white shadow-sm md:p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-gold">
        <ShieldCheck size={21} />
      </div>

      <h2 className="mt-5 text-lg font-semibold">Keep your network secure</h2>
      <p className="mt-2 text-sm leading-6 text-stone/70">
        Review pending requests and confirm the right access for every host.
      </p>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3">
          <span className="text-sm text-stone/80">Requests to review</span>
          <span className="font-semibold text-gold">06</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3">
          <span className="text-sm text-stone/80">Active hosts</span>
          <span className="font-semibold">24</span>
        </div>
      </div>

      <Link
        href="/admin/users"
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-white"
      >
        Review access
        <ChevronRight size={15} />
      </Link>
    </article>
  );
}
