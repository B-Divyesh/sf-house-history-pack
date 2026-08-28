import type { AppData, Attachment, Home, Settings } from './types';

const REAL_DB_NAME = 'house-history-pack';
const DB_VERSION = 1;
const STORES = ['home', 'assets', 'events', 'tasks', 'attachments', 'settings'] as const;
type StoreName = (typeof STORES)[number];

let dbPromise: Promise<IDBDatabase> | null = null;
let dbName = REAL_DB_NAME;

/** Select the isolated store before the app reads or writes any records. */
export function setStorageNamespace(namespace: 'real' | 'demo'): void {
  dbName = namespace === 'demo' ? 'demo:house-history-pack' : REAL_DB_NAME;
  dbPromise = null;
}

export function storageNamespace(): 'real' | 'demo' {
  return dbName.startsWith('demo:') ? 'demo' : 'real';
}

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage.'));
  });
  return dbPromise;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Local storage request failed.'));
  });
}

export async function all<T>(store: StoreName): Promise<T[]> {
  const db = await openDb();
  return requestResult(db.transaction(store).objectStore(store).getAll()) as Promise<T[]>;
}

export async function put<T>(store: StoreName, value: T): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(store, 'readwrite');
  tx.objectStore(store).put(value);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not save locally.'));
  });
}

export async function remove(store: StoreName, id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(store, 'readwrite');
  tx.objectStore(store).delete(id);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not remove the record.'));
  });
}

export async function clearAll(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction([...STORES], 'readwrite');
  for (const store of STORES) tx.objectStore(store).clear();
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not clear local records.'));
  });
}

/** Demo data is disposable: remove its entire database when the visitor leaves. */
export async function discardCurrentDatabase(): Promise<void> {
  const current = dbName;
  if (dbPromise) {
    try { (await dbPromise).close(); } catch { /* no open database to close */ }
  }
  dbPromise = null;
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(current);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Could not discard local demo data.'));
    request.onblocked = () => resolve();
  });
}

const defaultSettings: Settings = {
  id: 'settings', customPackTitle: '', handoverNote: '', presetAssetIds: [], updatedAt: new Date(0).toISOString()
};

export async function loadData(): Promise<AppData> {
  const [homes, assets, events, tasks, attachments, settings] = await Promise.all([
    all<Home>('home'), all('assets'), all('events'), all('tasks'), all<Attachment>('attachments'), all<Settings>('settings')
  ]);
  return {
    home: homes[0] ?? null,
    assets,
    events,
    tasks,
    attachments,
    settings: settings[0] ?? defaultSettings
  } as AppData;
}

export async function replaceData(data: AppData): Promise<void> {
  await clearAll();
  if (data.home) await put('home', data.home);
  await Promise.all([
    ...data.assets.map((v) => put('assets', v)),
    ...data.events.map((v) => put('events', v)),
    ...data.tasks.map((v) => put('tasks', v)),
    ...data.attachments.map((v) => put('attachments', v)),
    put('settings', data.settings)
  ]);
}
