import { Search, SlidersHorizontal } from "lucide-react";

type ListToolbarProps = {
  search: string;
  onSearch: (value: string) => void;
  searchLabel: string;
  status: string;
  onStatus: (value: string) => void;
  statuses: { value: string; label: string }[];
};

export default function ListToolbar({ search, onSearch, searchLabel, status, onStatus, statuses }: ListToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-navy/10 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
      <div className="relative w-full sm:max-w-xs">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={searchLabel}
          aria-label={searchLabel}
          className="field pl-9"
        />
      </div>
      <div className="relative w-full sm:w-auto">
        <SlidersHorizontal size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
        <select
          value={status}
          onChange={(event) => onStatus(event.target.value)}
          aria-label="Filter by status"
          className="field appearance-none pl-9 pr-8 sm:w-48"
        >
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
