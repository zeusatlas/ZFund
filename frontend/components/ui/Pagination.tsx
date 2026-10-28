import { ChevronLeft, ChevronRight } from "lucide-react";

/** Rows shown per page in admin tables. */
export const PAGE_SIZE = 10;

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize?: number;
  label: string;
  onPageChange: (page: number) => void;
};

const buttonClass =
  "inline-flex items-center gap-1 rounded-lg border border-navy/15 bg-white px-2.5 py-1.5 text-xs font-semibold text-steel transition-colors hover:bg-stone hover:text-navy disabled:cursor-not-allowed disabled:opacity-40";

/** Stays out of the way until there is more than one page of rows. */
export default function Pagination({ page, totalPages, total, pageSize = PAGE_SIZE, label, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 border-t border-navy/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
      <p className="text-xs text-steel">
        Showing <span className="font-semibold text-navy">{first}–{last}</span> of {total} {label}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={buttonClass}>
          <ChevronLeft size={14} aria-hidden="true" /> Previous
        </button>
        <span className="rounded-full bg-stone px-3 py-1 text-xs font-semibold text-navy">
          {page} / {totalPages}
        </span>
        <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className={buttonClass}>
          Next <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
