import { Search } from "lucide-react";
import FilterSelect from "@/components/ui/FilterSelect";

type ListToolbarProps = {
  search: string;
  onSearch: (value: string) => void;
  searchLabel: string;
  status: string;
  onStatus: (value: string) => void;
  statuses: { value: string; label: string }[];
  extraControls?: React.ReactNode;
};

export default function ListToolbar({
  search,
  onSearch,
  searchLabel,
  status,
  onStatus,
  statuses,
  extraControls,
}: ListToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-navy/10 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
      <div className="relative w-full sm:max-w-xs">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={searchLabel}
          aria-label={searchLabel}
          className="w-full rounded-lg border border-navy/15 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gold"
        />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(event) => onStatus(event.target.value)}
          aria-label="Filter by status"
          className="rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-sm text-steel outline-none focus:border-gold"
        >
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        {extraControls}
      </div>
    </div>
  );
}
