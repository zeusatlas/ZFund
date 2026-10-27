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
  "inline-flex items-center gap-1 rounded-md border border-navy/15 px-2.5 py-1.5 text-xs font-medium text-steel hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40";

/** Stays out of the way until there is more than one page of rows. */
export default function Pagination({ page, totalPages, total, pageSize = PAGE_SIZE, label, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between border-t border-navy/10 px-4 py-3 md:px-5">
      <p className="text-xs text-steel">
        Showing {first}–{last} of {total} {label}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={buttonClass}>
          <ChevronLeft size={14} /> Previous
        </button>
        <span className="text-xs font-medium text-navy">
          {page} / {totalPages}
        </span>
        <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className={buttonClass}>
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
