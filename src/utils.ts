export const uid = () => crypto.randomUUID();
export const now = () => new Date().toISOString();
export const today = () => new Date().toISOString().slice(0, 10);

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char] ?? char);
}

export function formatDate(value: string): string {
  if (!value) return 'Not recorded';
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? 'Not recorded' : new Intl.DateTimeFormat('en', {
    day: 'numeric', month: 'short', year: 'numeric'
  }).format(date);
}

export function formatMoney(value: number | null): string {
  return value === null || Number.isNaN(value) ? '—' : new Intl.NumberFormat('en', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 2
  }).format(value);
}

export function dueState(date: string): 'overdue' | 'soon' | 'later' {
  const days = Math.ceil((new Date(`${date}T12:00:00`).getTime() - Date.now()) / 86400000);
  if (days < 0) return 'overdue';
  if (days <= 30) return 'soon';
  return 'later';
}

export function safeFilename(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'house-history';
}

export function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < buffer.length; i += chunk) binary += String.fromCharCode(...buffer.subarray(i, i + chunk));
  return btoa(binary);
}

export function base64ToBlob(value: string, type: string): Blob {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type });
}
