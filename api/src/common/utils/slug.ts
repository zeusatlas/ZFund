export const RESERVED_SLUGS = new Set([
  'admin',
  'host',
  'api',
  'login',
  'register',
  'signup',
  'signin',
  'contact',
  'terms',
  'privacy',
  'settings',
  'dashboard',
  'system',
  'ussd',
  'ussd-flows',
  'webhooks',
  'auth',
  'payments',
  'contributions',
  'refunds',
  'notifications',
  'withdrawals',
  'help',
  'faq',
  'about',
  'c',
  'public',
  'payment',
  'assets',
  'images',
  'favicon',
]);

/**
 * Transforms any string into a clean URL-friendly slug.
 * e.g., "Koranteng Kessie" -> "koranteng-kessie"
 * e.g., "Emergency Surgery for Baby Kofi!" -> "emergency-surgery-for-baby-kofi"
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (except hyphens and spaces)
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

/**
 * Checks whether a requested slug conflicts with reserved system routes.
 */
export function isReservedSlug(slug: string): boolean {
  if (!slug) return true;
  return RESERVED_SLUGS.has(slug.toLowerCase().trim());
}

