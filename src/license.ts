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
  localStorage.setItem(CACHE_KEY, JSON.stringify({ valid: true, checkedAt: 0 } satisfies Verdict));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function cachedUnlock(): boolean {
  if (!localStorage.getItem(KEY)) return false;
  try { return (JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') as Verdict).valid === true; } catch { return false; }
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
    return { valid: cached?.valid ?? true, reason: cached?.reason, offline: true };
  }
}

export function saveLicense(token: string): void {
  localStorage.setItem(KEY, token.trim());
  localStorage.setItem(CACHE_KEY, JSON.stringify({ valid: true, checkedAt: 0 } satisfies Verdict));
}
