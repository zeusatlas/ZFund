/**
 * Normalises a Ghana mobile number to international digits (233XXXXXXXXX),
 * the format SMS providers expect. Other lengths are returned digits-only.
 */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('00233')) return digits.slice(2);
  if (digits.startsWith('233')) return digits;
  if (digits.length === 10 && digits.startsWith('0')) return `233${digits.slice(1)}`;
  if (digits.length === 9) return `233${digits}`;
  return digits;
}
