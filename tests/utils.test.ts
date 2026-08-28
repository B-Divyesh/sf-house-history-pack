import { describe, expect, it } from 'vitest';
import { dueState, escapeHtml, formatDate, safeFilename } from '../src/utils';
import { decryptBackup, encryptBackup } from '../src/backup';
import type { AppData } from '../src/types';

describe('record formatting', () => {
  it('escapes user content before rendering', () => {
    expect(escapeHtml('<img src=x onerror="bad">')).toBe('&lt;img src=x onerror=&quot;bad&quot;&gt;');
  });

  it('makes durable filenames and dates', () => {
    expect(safeFilename(' 12 Oak Street / Home ')).toBe('12-oak-street-home');
    expect(formatDate('2026-08-28')).toContain('2026');
  });

  it('classifies old due dates as overdue', () => {
    expect(dueState('2000-01-01')).toBe('overdue');
  });
});

describe('encrypted portable backup', () => {
  it('round-trips records and attachment bytes', async () => {
    const stamp = '2026-08-28T00:00:00.000Z';
    const data: AppData = {
      home: { id: 'home', name: 'Test house', address: '', updatedAt: stamp },
      assets: [], events: [], tasks: [],
      attachments: [{ id: 'a1', eventId: 'e1', name: 'note.txt', type: 'text/plain', size: 5, blob: new Blob(['hello']), createdAt: stamp }],
      settings: { id: 'settings', customPackTitle: '', handoverNote: '', presetAssetIds: [], updatedAt: stamp }
    };
    const encrypted = await encryptBackup(data, 'correct horse');
    const restored = await decryptBackup(await encrypted.text(), 'correct horse');
    expect(restored.home?.name).toBe('Test house');
    expect(await restored.attachments[0]?.blob.text()).toBe('hello');
  });

  it('rejects a wrong password', async () => {
    const data = { home: null, assets: [], events: [], tasks: [], attachments: [], settings: { id: 'settings' as const, customPackTitle: '', handoverNote: '', presetAssetIds: [], updatedAt: '' } };
    const encrypted = await encryptBackup(data, 'right-password');
    await expect(decryptBackup(await encrypted.text(), 'wrong-password')).rejects.toThrow('password');
  });
});
