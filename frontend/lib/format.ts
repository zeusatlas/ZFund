import { formatDistanceToNow } from "date-fns";

const cedi = new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", currencyDisplay: "code" });

/** Backend money values are decimal strings, e.g. "248560.00". */
export function formatMoney(value: string | number) {
  return cedi.format(Number(value)).replace(/\u00a0/g, " ");
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-GH").format(value);
}

export function timeAgo(iso: string | null | undefined, fallback = "Never") {
  return iso ? formatDistanceToNow(new Date(iso), { addSuffix: true }) : fallback;
}

export function formatChange(pct: number | null, suffix = "vs last month") {
  if (pct === null) return `No data ${suffix}`;
  return `${pct > 0 ? "+" : ""}${pct}% ${suffix}`;
}
