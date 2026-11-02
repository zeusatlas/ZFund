/**
 * Telcos and card networks often return names in capitals ("ESTHER LARDZE"). Those read as shouting,
 * so an all-caps or all-lowercase name becomes capitalised words ("Esther Lardze").
 * Names that already mix cases ("McDonald", "De Graft") are left exactly as written.
 */
export function formatPersonName(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (!trimmed) return trimmed;
  const isSingleCase = trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase();
  if (!isSingleCase) return trimmed;
  return trimmed
    .toLowerCase()
    .replace(/(^|[\s\-'’.])(\p{L})/gu, (_match, sep: string, letter: string) => sep + letter.toUpperCase());
}
