export type RecordId = string;

export interface Home {
  id: 'home';
  name: string;
  address: string;
  yearBuilt?: string;
  updatedAt: string;
}

export interface Asset {
  id: RecordId;
  name: string;
  category: string;
  location: string;
  make: string;
  model: string;
  serial: string;
  installedOn: string;
  warrantyUntil: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type EventKind = 'service' | 'repair' | 'permit' | 'inspection' | 'note';

export interface HistoryEvent {
  id: RecordId;
  assetId: RecordId | '';
  kind: EventKind;
  title: string;
  date: string;
  contractor: string;
  cost: number | null;
  notes: string;
  attachmentIds: RecordId[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: RecordId;
  assetId: RecordId | '';
  title: string;
  dueDate: string;
  repeatMonths: number | null;
  complete: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: RecordId;
  eventId: RecordId;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  createdAt: string;
}

export interface Settings {
  id: 'settings';
  customPackTitle: string;
  handoverNote: string;
  presetAssetIds: RecordId[];
  updatedAt: string;
}

export interface AppData {
  home: Home | null;
  assets: Asset[];
  events: HistoryEvent[];
  tasks: Task[];
  attachments: Attachment[];
  settings: Settings;
}

export type ViewName = 'overview' | 'assets' | 'history' | 'tasks' | 'pack';
