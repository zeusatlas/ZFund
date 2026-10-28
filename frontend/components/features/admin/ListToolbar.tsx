import { Search } from "lucide-react";
import FilterSelect from "@/components/ui/FilterSelect";

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
          className="w-full rounded-lg border border-navy/15 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gold"
        />
      </div>
      <FilterSelect
        label="Filter by status"
        className="w-full sm:w-48"
        value={status}
        onChange={onStatus}
        options={[{ value: "", label: "All statuses" }, ...statuses]}
      />
    </div>
  );
}
