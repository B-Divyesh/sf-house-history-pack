const SLUG = 'house-history-pack';
const KEY = `sb_license:${SLUG}`;
const CACHE_KEY = `${KEY}:verdict`;
const API = 'https://api.sociobot.in/api/v1';

interface Verdict { valid: boolean; checkedAt: number; reason?: string }

export const checkoutUrl = `${API}/products/${SLUG}/checkout`;

export function acceptReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(KEY, token);
  // A returned token is only a candidate until the billing API confirms it.
  // Never treat possession of an arbitrary string as a paid entitlement.
  localStorage.removeItem(CACHE_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function cachedUnlock(): boolean {
  if (!localStorage.getItem(KEY)) return false;
  try {
    const verdict = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as Verdict;
    return verdict.valid === true && verdict.checkedAt > 0;
  } catch { return false; }
}

export async function verifyLicense(force = false): Promise<{ valid: boolean; reason?: string; offline?: boolean }> {
  const token = localStorage.getItem(KEY);
  if (!token) return { valid: false, reason: 'missing' };
  let cached: Verdict | null = null;
  try { cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as Verdict | null; } catch { /* ignore */ }
  if (!force && cached && Date.now() - cached.checkedAt < 86400000) return cached;
  try {
    const response = await fetch(`${API}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification unavailable');
    const body = await response.json() as { valid: boolean; reason?: string };
    const verdict: Verdict = { valid: body.valid, reason: body.reason, checkedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(verdict));
    return verdict;
  } catch {
    // Previously verified licenses keep working offline. New or unverified
    // tokens stay locked when verification is unavailable.
    return { valid: cached?.valid === true && cached.checkedAt > 0, reason: cached?.reason ?? 'unverified', offline: true };
  }
}

export function saveLicense(token: string): void {
  localStorage.setItem(KEY, token.trim());
  localStorage.removeItem(CACHE_KEY);
}
