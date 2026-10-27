import { fundTrend } from "./data";

const months = [
  "Nov", "Dec", "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug", "Sep", "Oct",
];

export function FundGeneration() {
  return (
    <article className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-navy">Fund generation</h2>
          <p className="mt-1 text-sm text-steel">
            Monthly activity across all host accounts
          </p>
        </div>
        <select
          aria-label="Fund generation period"
          className="rounded-lg border border-navy/10 bg-white px-2.5 py-2 text-xs text-steel outline-none"
        >
          <option>Last 12 months</option>
          <option>Last 30 days</option>
        </select>
      </div>

      <div className="mt-7 flex h-44 items-end gap-2 px-1 sm:gap-3">
        {fundTrend.map((height, index) => (
          <div
            key={months[index]}
            className="group flex h-full flex-1 flex-col justify-end"
          >
            <div
              className="relative w-full rounded-t-md bg-[#dce9e5] transition-colors group-hover:bg-gold"
              style={{ height: `${height}%` }}
            >
              <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-midnight px-1.5 py-1 text-[10px] text-white group-hover:block">
                {height}%
              </span>
            </div>
            <span className="mt-2 text-center text-[10px] text-steel">
              {months[index]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-navy/10 pt-4">
        <div>
          <p className="text-xs text-steel">Average monthly generation</p>
          <p className="mt-1 text-lg font-semibold text-navy">GHS 20,713.33</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-steel">This month</p>
          <p className="mt-1 text-lg font-semibold text-[#287754]">GHS 28,640.00</p>
        </div>
      </div>
    </article>
  );
}
