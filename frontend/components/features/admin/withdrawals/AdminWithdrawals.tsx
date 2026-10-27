import { Banknote } from "lucide-react";

export default function AdminWithdrawals() {
  return (
    <div className="w-full space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-navy md:text-3xl">Withdrawals</h1>
        <p className="mt-2 text-sm text-steel">Review and manage withdrawal requests from your hosts.</p>
      </section>

      <section className="flex flex-col items-center rounded-xl border border-navy/10 bg-white px-6 py-14 text-center shadow-sm">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-stone text-navy">
          <Banknote size={20} />
        </span>
        <h2 className="mt-4 font-semibold text-navy">No withdrawal requests</h2>
        <p className="mt-1 max-w-sm text-sm text-steel">
          Withdrawal requests from hosts will appear here once payouts are enabled.
        </p>
      </section>
    </div>
  );
}
