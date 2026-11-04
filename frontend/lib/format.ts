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

/**
 * Names from telcos and card networks often arrive in capitals ("ESTHER LARDZE"). All-caps or
 * all-lowercase names become capitalised words; names that already mix cases are left as written.
 */
export function formatPersonName(name?: string | null): string {
  const trimmed = (name ?? "").trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  if (trimmed !== trimmed.toUpperCase() && trimmed !== trimmed.toLowerCase()) return trimmed;
  return trimmed.toLowerCase().replace(/(^|[\s\-'’.])(\p{L})/gu, (_m, sep: string, letter: string) => sep + letter.toUpperCase());
}

/**
 * The real name to show on host and admin dashboards: the first usable name from the payment provider,
 * or the donor's own entry for that donation. Placeholders ("Anonymous", "Donor 1234") are skipped.
 * Returns "" when none is usable, so callers can choose their own fallback.
 */
export function pickDonorName(...names: Array<string | null | undefined>): string {
  for (const name of names) {
    const cleaned = formatPersonName(name);
    if (cleaned && !/^(anonymous( supporter)?|donor \d*|kind supporter|generous supporter)$/i.test(cleaned)) return cleaned;
  }
  return "";
}
