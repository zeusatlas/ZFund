/**
 * Normalises a Ghana mobile number to international digits (233XXXXXXXXX),
 * the format SMS providers expect. Other lengths are returned digits-only.
 */
export function normalizePhone(input: string): string {
  const digits = (input || '').replace(/\D/g, '');
  if (digits.startsWith('00233')) return digits.slice(2);
  if (digits.startsWith('233')) return digits;
  if (digits.length === 10 && digits.startsWith('0')) return `233${digits.slice(1)}`;
  if (digits.length === 9) return `233${digits}`;
  return digits;
}

/**
 * Normalises a phone number to standard Ghana local 10-digit format (0XXXXXXXXX)
 * used by telcos and payment collection gateways.
 */
export function normalizeGhanaPhone(phone: string): string {
  let cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.startsWith('233') && cleaned.length >= 12) {
    cleaned = '0' + cleaned.slice(3);
  }
  if (cleaned.length === 9 && !cleaned.startsWith('0')) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

/**
 * Detects the Ghana telecommunication network by prefix
 */
export function detectGhanaNetwork(phone: string): 'mtn' | 'vod' | 'atl' {
  const clean = normalizeGhanaPhone(phone);
  const prefix = clean.slice(0, 3);
  if (['024', '054', '055', '059', '053'].includes(prefix)) {
    return 'mtn';
  }
  if (['020', '050'].includes(prefix)) {
    return 'vod';
  }
  if (['027', '057', '026', '056'].includes(prefix)) {
    return 'atl';
  }
  return 'mtn';
}
