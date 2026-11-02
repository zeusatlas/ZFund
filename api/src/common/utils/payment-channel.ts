import { detectGhanaNetwork } from './phone';

type AttemptLike = {
  channel?: string | null;
  msisdn?: string | null;
  metadata?: Record<string, unknown> | null;
};

const MOMO_BY_NETWORK: Record<string, string> = {
  mtn: 'MTN MoMo',
  vod: 'Tel Cash',
  atl: 'AT Money',
};

/** Maps whatever RobsPay reports as the network onto the names donors and hosts know. */
function normaliseNetwork(raw: string): string | null {
  const value = raw.toLowerCase();
  if (value.includes('mtn')) return 'mtn';
  if (value.includes('telecel') || value.includes('vodafone') || value.includes('vod')) return 'vod';
  if (value.includes('airtel') || value.includes('tigo') || /\bat\b/.test(value)) return 'atl';
  return null;
}

function cardBrand(raw: string): string | null {
  const value = raw.toLowerCase();
  if (value.includes('visa')) return 'Visa';
  if (value.includes('master')) return 'Mastercard';
  if (value.includes('amex') || value.includes('american')) return 'American Express';
  return null;
}

/**
 * Human label for how a contribution was paid, e.g. "MTN MoMo", "Telecel Cash" or "Visa card".
 * Uses the network RobsPay reported on the callback and falls back to the phone prefix for mobile money.
 */
export function describePaymentChannel(attempt?: AttemptLike | null): string | null {
  if (!attempt) return null;
  const reported = String(attempt.metadata?.network ?? attempt.metadata?.cardBrand ?? '').trim();

  if (attempt.channel === 'card') {
    const brand = cardBrand(reported);
    return brand ? `${brand} card` : 'Card';
  }

  const network = (reported && normaliseNetwork(reported)) || (attempt.msisdn ? detectGhanaNetwork(attempt.msisdn) : null);
  return network ? MOMO_BY_NETWORK[network] : 'Mobile money';
}

/** The attempt that settled the payment, otherwise the most recent one. */
export function pickRelevantAttempt<T extends { status?: string; createdAt?: Date | string }>(
  attempts?: T[] | null
): T | undefined {
  if (!attempts?.length) return undefined;
  const successful = attempts.find((a) => a.status === 'SUCCESSFUL');
  if (successful) return successful;
  return [...attempts].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  )[0];
}
