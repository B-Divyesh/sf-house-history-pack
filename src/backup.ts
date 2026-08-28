import type { AppData } from './types';
import { base64ToBlob, blobToBase64 } from './utils';

type PortableAttachment = Omit<AppData['attachments'][number], 'blob'> & { data: string };
type PortableData = Omit<AppData, 'attachments'> & { attachments: PortableAttachment[]; exportedAt: string; format: 1 };

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export async function toPortable(data: AppData): Promise<PortableData> {
  return {
    ...data,
    attachments: await Promise.all(data.attachments.map(async ({ blob, ...item }) => ({
      ...item, data: await blobToBase64(blob)
    }))),
    exportedAt: new Date().toISOString(),
    format: 1
  };
}

export function fromPortable(value: unknown): AppData {
  if (!value || typeof value !== 'object') throw new Error('This file is not a House History Pack backup.');
  const item = value as Partial<PortableData>;
  if (item.format !== 1 || !Array.isArray(item.assets) || !Array.isArray(item.events) || !Array.isArray(item.tasks) || !Array.isArray(item.attachments)) {
    throw new Error('This backup is missing required records or uses an unsupported version.');
  }
  return {
    home: item.home ?? null,
    assets: item.assets,
    events: item.events,
    tasks: item.tasks,
    settings: item.settings ?? { id: 'settings', customPackTitle: '', handoverNote: '', presetAssetIds: [], updatedAt: new Date().toISOString() },
    attachments: item.attachments.map(({ data, type, ...attachment }) => ({
      ...attachment, type, blob: base64ToBlob(data, type)
    }))
  };
}

export async function encryptBackup(data: AppData, password: string): Promise<Blob> {
  if (password.length < 8) throw new Error('Use at least 8 characters for the backup password.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' }, material,
    { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  );
  const plaintext = new TextEncoder().encode(JSON.stringify(await toPortable(data)));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext));
  const envelope = { format: 'house-history-pack-encrypted', version: 1, kdf: 'PBKDF2-SHA256', iterations: 250000, salt: bytesToBase64(salt), iv: bytesToBase64(iv), data: bytesToBase64(ciphertext) };
  return new Blob([JSON.stringify(envelope)], { type: 'application/vnd.house-history-pack+json' });
}

export async function decryptBackup(text: string, password: string): Promise<AppData> {
  let envelope: { format?: string; salt?: string; iv?: string; data?: string; iterations?: number };
  try { envelope = JSON.parse(text) as typeof envelope; } catch { throw new Error('The selected file is not valid JSON.'); }
  if (envelope.format !== 'house-history-pack-encrypted' || !envelope.salt || !envelope.iv || !envelope.data) throw new Error('This is not an encrypted House History Pack backup.');
  try {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: base64ToBytes(envelope.salt), iterations: envelope.iterations ?? 250000, hash: 'SHA-256' }, material,
      { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(envelope.iv), length: 128 }, key, base64ToBytes(envelope.data));
    return fromPortable(JSON.parse(new TextDecoder().decode(plaintext)));
  } catch {
    throw new Error('That password did not unlock the backup, or the file is damaged.');
  }
}
