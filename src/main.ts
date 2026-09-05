import './style.css';
import { discardCurrentDatabase, loadData, put, putHistoryWithAttachments, remove, replaceData, setStorageNamespace } from './db';
import { sampleData } from './demo';
import { decryptBackup, encryptBackup, fromPortable, toPortable } from './backup';
import { acceptReturnedLicense, cachedUnlock, checkoutUrl, saveLicense, verifyLicense } from './license';
import type { AppData, Asset, Attachment, HistoryEvent, Task, ViewName } from './types';
import { download, dueState, escapeHtml, formatDate, formatMoney, now, safeFilename, today, uid } from './utils';
import { watchForServiceWorkerUpdate } from './service-worker-update';

const app = document.querySelector<HTMLDivElement>('#app')!;
let data: AppData;
let view: ViewName = 'overview';
let online = navigator.onLine;
let plus = false;
let pendingImport: File | null = null;
let packAssetIds = new Set<string>();
// Keep the shareable query entry point and the short /demo route equivalent.
// Both select the demo database before any storage call is made.
const demoMode = location.pathname.replace(/\/+$/, '') === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
const demoUrl = '/?demo=1';
const siteUrl = 'https://house-history-pack.sociobot.in';
const VIEW_LABELS: Record<ViewName, string> = { overview: 'Overview', assets: 'Assets', history: 'History', tasks: 'Tasks', pack: 'Build pack' };

function pageTitle(next: ViewName): string {
  if (next === 'overview') return demoMode ? 'Demo — House History Pack' : 'House History Pack — Keep home history ready';
  return `${VIEW_LABELS[next]} — House History Pack`;
}

function setMeta(selector: string, content: string): void {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

function syncRouteMetadata(next: ViewName): void {
  const demo = demoMode;
  const title = demo ? 'Demo — House History Pack' : 'House History Pack — Keep home history ready';
  const description = demo
    ? 'Explore a separate House History Pack sample. It stays in a disposable browser-only demo space.'
    : 'Keep home records, repairs, permits, warranties, and evidence ready for a service call or handover.';
  const url = `${siteUrl}${demo ? '/demo' : '/'}`;

  document.title = pageTitle(next);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:url"]', url);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
}

const icon = (name: string) => ({
  overview: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 11 12 4l8 7v9h-6v-6h-4v6H4Z"/></svg>',
  assets: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 5h14v14H5zM9 5v14M5 10h14"/></svg>',
  history: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 7v5l3 2M4 12a8 8 0 1 0 2-5.7L4 8M4 4v4h4"/></svg>',
  tasks: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
  pack: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4h10l4 4v12H5zM15 4v5h4M8 13h8M8 17h8"/></svg>',
  plus: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
})[name] ?? '';

function navItem(name: ViewName, label: string): string {
  return `<button class="nav-item ${view === name ? 'active' : ''}" data-view="${name}" aria-current="${view === name ? 'page' : 'false'}">${icon(name)}<span>${label}</span></button>`;
}

function assetName(id: string): string { return data.assets.find((item) => item.id === id)?.name ?? 'Whole property'; }

function render(): void {
  const due = data.tasks.filter((task) => !task.complete).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const warranties = data.assets.filter((asset) => asset.warrantyUntil).sort((a, b) => a.warrantyUntil.localeCompare(b.warrantyUntil));
  app.innerHTML = `
    <header class="topbar">
      <a class="brand" href="${demoMode ? demoUrl : '/'}" aria-label="House History Pack overview"><span class="brand-mark"><i></i><i></i><i></i></span><span>House History Pack</span></a>
      <div class="top-actions">
        <span class="privacy-chip"><span class="status-dot"></span>Stored on this device</span>
        <button class="button primary compact" data-action="quick-add">${icon('plus')} Add record</button>
      </div>
    </header>
    ${demoMode ? `<aside class="demo-banner" aria-label="Demo controls"><strong>Demo — sample data, nothing is saved</strong><span>Juniper House is separate from your records.</span><button class="text-button" data-action="reset-demo">Reset demo</button><button class="button secondary demo-start" data-action="start-real">Start for real</button></aside>` : ''}
    <div class="app-layout">
      <nav class="side-nav" aria-label="Primary navigation">
        ${navItem('overview', 'Overview')}${navItem('assets', 'Assets')}${navItem('history', 'History')}${navItem('tasks', 'Tasks')}${navItem('pack', 'Build pack')}
        <div class="nav-spacer"></div>
        <button class="nav-item" data-action="settings">${icon('plus')}<span>Home details</span></button>
      </nav>
      <main id="main" tabindex="-1">
        <div class="page-heading">
          <div><p class="eyebrow">${escapeHtml(data.home?.name || 'A private record for your property')}</p><h1 tabindex="-1">Keep your home history ready to share.</h1>${!data.home ? '<p class="audience">For homeowners building a durable service and handover record.</p>' : ''}</div>
          ${data.home ? `<p class="address">${escapeHtml(data.home.address || 'Address kept private')}<span>${data.assets.length} assets · ${data.events.length} history records</span></p>` : ''}
        </div>
        ${renderView()}
      </main>
      <aside class="signals" aria-label="Upcoming tasks and warranties">
        <div class="signal-heading"><p class="eyebrow">Upcoming tasks and warranties</p><span class="live-tag">${online ? 'Local & ready' : 'Offline & ready'}</span></div>
        ${!due.length && !warranties.length ? `<div class="quiet-state"><span class="orb"></span><h2>Nothing urgent</h2><p>Due work and warranty dates will surface here.</p><button class="text-button" data-action="add-task">Add a task</button></div>` : `
          <div class="signal-list">
            ${due.slice(0, 4).map((task) => `<button class="signal-row" data-view="tasks"><span class="signal-icon ${dueState(task.dueDate)}"></span><span><b>${escapeHtml(task.title)}</b><small>${dueState(task.dueDate) === 'overdue' ? 'Overdue · ' : 'Due '}${formatDate(task.dueDate)}</small></span></button>`).join('')}
            ${warranties.slice(0, Math.max(0, 4 - due.length)).map((asset) => `<button class="signal-row" data-view="assets"><span class="signal-icon warranty"></span><span><b>${escapeHtml(asset.name)} warranty</b><small>Ends ${formatDate(asset.warrantyUntil)}</small></span></button>`).join('')}
          </div>`}
        <div class="local-note"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 10V8a5 5 0 0 1 10 0v2M5 10h14v10H5z"/></svg><p><strong>Private by default</strong>Your records and files stay in this browser unless you export them.</p></div>
      </aside>
    </div>
    <footer><span>Private home records for service and handover.</span><span><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory</a><small>v1.0.1</small><button class="footer-link" data-action="import">Import backup</button></span><input id="import-file" class="visually-hidden" type="file" accept=".hhpack,.json,application/json" aria-label="Choose a House History Pack backup to import" /></footer>
    ${dialogs()}
    <div id="route-announcer" class="visually-hidden" role="status" aria-live="polite"></div>
    <div id="toast" class="toast" role="status" aria-live="polite"></div>
  `;
  bindEvents();
}

function renderView(): string {
  if (view === 'assets') return renderAssets();
  if (view === 'history') return renderHistory();
  if (view === 'tasks') return renderTasks();
  if (view === 'pack') return renderPack();
  return renderOverview();
}

function renderOverview(): string {
  const hasRecords = data.assets.length || data.events.length;
  const recent = [...data.events].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const sampleAsset = demoMode ? data.assets.find((asset) => asset.id === 'water-heater') ?? data.assets[0] : undefined;
  return `<section class="overview-view" aria-labelledby="overview-title">
    <h2 id="overview-title" class="visually-hidden">Home overview</h2>
    <div class="hero-pane ${hasRecords ? 'compact-hero' : ''}">
      <picture><source srcset="/assets/house-ledger.webp" type="image/webp"><img src="/assets/house-ledger.webp" width="1200" height="800" alt="A glass architectural cutaway of a house with repair documents organized through its rooms" fetchpriority="high" decoding="async"></picture>
      <div class="hero-copy">
        <h2>${hasRecords ? `Your home records are ready to use.` : `Keep every home record together.`}</h2>
        ${sampleAsset ? `<article class="demo-record-preview" data-demo-record aria-label="Sample record: ${escapeHtml(sampleAsset.name)}"><p>Sample asset</p><h3>${escapeHtml(sampleAsset.name)}</h3><small>Warranty until ${formatDate(sampleAsset.warrantyUntil)}</small></article>` : `<p class="hero-summary">Keep appliances, repairs, permits, warranties, and evidence ready for service or handover.</p>`}
        ${!data.home ? `<div class="hero-actions"><button class="button primary" data-action="try-demo">Try it with sample data</button><small>Loads a separate, disposable sample house.</small><button class="button secondary" data-action="setup-home">Set up your home</button></div><ul class="hero-facts"><li>Stored on this device</li><li>Works offline after the first visit</li><li>Pack Plus is $29 once for custom cover text and saved pack settings</li></ul>` : `<button class="button primary" data-action="quick-add">Add your next record</button>`}
      </div>
    </div>
    <div class="metric-strip" aria-label="Record summary">
      <button data-view="assets"><strong>${data.assets.length}</strong><span>Assets</span><small>${data.assets.length ? 'Tracked in one place' : 'Add appliances & systems'}</small></button>
      <button data-view="history"><strong>${data.events.length}</strong><span>History records</span><small>${data.events.length ? 'Repairs, service & permits' : 'Log your first event'}</small></button>
      <button data-view="tasks"><strong>${data.tasks.filter((task) => !task.complete).length}</strong><span>Open tasks</span><small>Seasonal & next-due work</small></button>
      <button data-view="pack"><strong>${data.attachments.length}</strong><span>Evidence files</span><small>Receipts, manuals & permits</small></button>
    </div>
    <section class="how-it-works" aria-labelledby="how-it-works-title">
      <div class="section-heading"><div><p class="eyebrow">A clear path from receipt to record</p><h2 id="how-it-works-title">How to make a house history pack</h2></div></div>
      <ol>
        <li><span>01</span><div><h3>Add systems</h3><p>Name the appliances and systems you need to identify later.</p></div></li>
        <li><span>02</span><div><h3>Log work and attach evidence</h3><p>Save repairs, service dates, permits, and the files behind them.</p></div></li>
        <li><span>03</span><div><h3>Export a pack</h3><p>Choose the records to share, then download a PDF or ZIP.</p></div></li>
      </ol>
    </section>
    <section class="recent-section"><div class="section-heading"><div><p class="eyebrow">Recent home history</p><h2>Recent history</h2></div><button class="text-button" data-view="history">View all history</button></div>
      ${recent.length ? `<ol class="timeline">${recent.map(eventRow).join('')}</ol>` : `<div class="empty-row"><span class="empty-mark">01</span><div><h3>Add your first home record</h3><p>Record a service visit, repair, permit, inspection, or contractor note.</p></div><button class="button secondary" data-action="add-event">Log history</button></div>`}
    </section>
  </section>`;
}

function renderAssets(): string {
  return `<section aria-labelledby="assets-title"><div class="section-heading"><div><p class="eyebrow">What belongs to the house</p><h2 id="assets-title">Assets & systems</h2></div><button class="button primary" data-action="add-asset">${icon('plus')} Add asset</button></div>
  ${data.assets.length ? `<div class="asset-grid">${data.assets.map((asset) => `<article class="asset-card"><div class="asset-top"><span class="asset-glyph">${escapeHtml(asset.category.slice(0, 2).toUpperCase() || 'HM')}</span><span class="tag">${escapeHtml(asset.category || 'Home asset')}</span></div><h3>${escapeHtml(asset.name)}</h3><p>${escapeHtml([asset.make, asset.model].filter(Boolean).join(' · ') || asset.location || 'Details not recorded')}</p><dl><div><dt>Location</dt><dd>${escapeHtml(asset.location || '—')}</dd></div><div><dt>Installed</dt><dd>${formatDate(asset.installedOn)}</dd></div><div><dt>Warranty</dt><dd>${formatDate(asset.warrantyUntil)}</dd></div><div><dt>History</dt><dd>${data.events.filter((event) => event.assetId === asset.id).length} records</dd></div></dl><div class="card-actions"><button class="text-button" data-action="edit-asset" data-id="${asset.id}">Edit details</button><button class="icon-button danger" data-action="delete-asset" data-id="${asset.id}" aria-label="Delete ${escapeHtml(asset.name)}">Delete</button></div></article>`).join('')}</div>` : emptyState('assets', 'Add the things a future you will need to identify.', 'Start with the water heater, boiler, roof, electrical panel, or a major appliance.', 'Add an asset', 'add-asset')}
  </section>`;
}

function eventRow(event: HistoryEvent): string {
  const files = data.attachments.filter((item) => event.attachmentIds.includes(item.id));
  return `<li class="timeline-row"><span class="timeline-date"><b>${formatDate(event.date).split(' ')[0]}</b><small>${formatDate(event.date).split(' ').slice(1).join(' ')}</small></span><span class="timeline-line"><i></i></span><article><div class="row-kicker"><span class="tag">${escapeHtml(event.kind)}</span><span>${escapeHtml(assetName(event.assetId))}</span></div><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml([event.contractor, event.notes].filter(Boolean).join(' · ') || 'No additional notes')}</p>${event.cost !== null ? `<strong class="cost">${formatMoney(event.cost)}</strong>` : ''}${files.length ? `<div class="file-list">${files.map((file) => `<button data-action="download-file" data-id="${file.id}"><span>↧</span>${escapeHtml(file.name)} <small>${Math.max(1, Math.round(file.size / 1024))} KB</small></button>`).join('')}</div>` : ''}<div class="row-actions"><button class="text-button" data-action="edit-event" data-id="${event.id}">Edit</button><button class="text-button danger-text" data-action="delete-event" data-id="${event.id}">Delete</button></div></article></li>`;
}

function renderHistory(): string {
  const events = [...data.events].sort((a, b) => b.date.localeCompare(a.date));
  return `<section aria-labelledby="history-title"><div class="section-heading"><div><p class="eyebrow">Proof over time</p><h2 id="history-title">Service, repairs & permits</h2></div><button class="button primary" data-action="add-event">${icon('plus')} Log history</button></div>
  ${events.length ? `<ol class="timeline full-timeline">${events.map(eventRow).join('')}</ol>` : emptyState('history', 'Build the record while details are fresh.', 'Log who came, what changed, how much it cost, and attach the evidence.', 'Log your first event', 'add-event')}</section>`;
}

function renderTasks(): string {
  const tasks = [...data.tasks].sort((a, b) => Number(a.complete) - Number(b.complete) || a.dueDate.localeCompare(b.dueDate));
  return `<section aria-labelledby="tasks-title"><div class="section-heading"><div><p class="eyebrow">Keep the next date visible</p><h2 id="tasks-title">Seasonal & next-due work</h2></div><button class="button primary" data-action="add-task">${icon('plus')} Add task</button></div>
  ${tasks.length ? `<ul class="task-list">${tasks.map((task) => `<li class="task-row ${task.complete ? 'done' : ''}"><label class="check-control"><input type="checkbox" data-action="toggle-task" data-id="${task.id}" ${task.complete ? 'checked' : ''}><span></span><span><b>${escapeHtml(task.title)}</b><small>${escapeHtml(assetName(task.assetId))} · ${task.complete ? 'Completed' : `Due ${formatDate(task.dueDate)}`}${task.repeatMonths ? ` · Repeats every ${task.repeatMonths} months` : ''}</small></span></label><span class="due-label ${task.complete ? '' : dueState(task.dueDate)}">${task.complete ? 'Done' : dueState(task.dueDate)}</span><span class="task-actions"><button class="text-button" data-action="edit-task" data-id="${task.id}">Edit</button><button class="icon-button danger" data-action="delete-task" data-id="${task.id}" aria-label="Delete ${escapeHtml(task.title)}">Delete</button></span></li>`).join('')}</ul>` : emptyState('tasks', 'Turn the calendar into a durable record.', 'Add seasonal work, next service dates, and repeating maintenance.', 'Add a task', 'add-task')}</section>`;
}

function renderPack(): string {
  return `<section aria-labelledby="pack-title"><div class="section-heading pack-heading"><div><p class="eyebrow">The primary artifact</p><h2 id="pack-title">Build a portable history pack</h2><p class="measure">Select what belongs, then create a clean PDF or a ZIP with original evidence. Nothing is uploaded.</p></div></div>
    <div class="pack-layout"><form id="pack-form" class="pack-builder"><fieldset><legend>1. Choose assets</legend><div class="selection-tools"><button type="button" class="text-button" data-action="select-all">Select all</button><button type="button" class="text-button" data-action="select-none">Clear</button></div>${data.assets.length ? `<div class="asset-checks">${data.assets.map((asset) => `<label class="select-row"><input type="checkbox" name="asset" value="${asset.id}" ${packAssetIds.has(asset.id) ? 'checked' : ''}><span class="custom-check">✓</span><span><b>${escapeHtml(asset.name)}</b><small>${data.events.filter((event) => event.assetId === asset.id).length} history records · ${data.attachments.filter((file) => data.events.some((event) => event.assetId === asset.id && event.attachmentIds.includes(file.id))).length} files</small></span></label>`).join('')}</div>` : `<p class="field-note">No assets yet. General property history can still be exported.</p>`}</fieldset>
      <fieldset><legend>2. Include</legend><label class="switch-row"><span><b>Whole-property records</b><small>Permits and notes not linked to an asset</small></span><input type="checkbox" name="general" checked></label><label class="switch-row"><span><b>Upcoming tasks</b><small>Open and completed maintenance</small></span><input type="checkbox" name="tasks" checked></label><label class="switch-row"><span><b>Original evidence in ZIP</b><small>Receipts, manuals, photos, and permits</small></span><input type="checkbox" name="attachments" checked></label></fieldset>
      ${plus ? `<fieldset><legend>3. Presentation</legend><label>Pack title<input name="packTitle" value="${escapeHtml(data.settings.customPackTitle)}" placeholder="The Oak Street house record"></label><label>Handover note<textarea name="handoverNote" rows="3" placeholder="A short note for the buyer or service person">${escapeHtml(data.settings.handoverNote)}</textarea></label><button type="button" class="text-button" data-action="save-preset">Save these Plus settings</button></fieldset>` : `<div class="unlock-pane"><span class="plus-badge">Pack Plus</span><div><h3>Make the handover feel finished.</h3><p>Add a custom cover title, handover note, and reusable selection preset. One-time purchase, $29.</p></div><a class="button secondary" href="${checkoutUrl}">Buy Pack Plus</a><button type="button" class="text-button" data-action="restore-license">Have a license? Restore it</button></div>`}
      <div class="export-actions"><button type="button" class="button primary" data-action="export-pdf">Create PDF</button><button type="button" class="button secondary" data-action="export-zip">Create ZIP + evidence</button><button type="button" class="text-button" data-action="json-backup">Export JSON backup</button><button type="button" class="text-button lock-button" data-action="encrypted-backup">Encrypted full backup</button><small>PDF and ZIP use your current selection. Full backups include every record and attachment for transfer or restore.</small></div>
    </form><aside class="pack-preview"><p class="eyebrow">Pack preview</p><div class="paper-preview"><div class="paper-band"></div><span>House history pack</span><h3>${escapeHtml((plus && data.settings.customPackTitle) || data.home?.name || 'Your property')}</h3><p>${escapeHtml(data.home?.address || 'Private property record')}</p><div class="paper-metrics"><b>${packAssetIds.size}</b> assets <b>${data.events.filter((event) => packAssetIds.has(event.assetId) || !event.assetId).length}</b> records</div><div class="paper-lines"><i></i><i></i><i></i><i></i></div></div><p>Jurisdiction-neutral and clearly marked as a homeowner-maintained record.</p></aside></div>
  </section>`;
}

function emptyState(kind: string, title: string, body: string, action: string, actionName: string): string {
  return `<div class="empty-state"><span class="empty-visual ${kind}"><i></i><i></i><i></i></span><h3>${title}</h3><p>${body}</p><button class="button primary" data-action="${actionName}">${action}</button></div>`;
}

function options(selected = ''): string {
  return `<option value="">Whole property</option>${data.assets.map((asset) => `<option value="${asset.id}" ${selected === asset.id ? 'selected' : ''}>${escapeHtml(asset.name)}</option>`).join('')}`;
}

function dialogs(): string {
  return `<dialog id="record-menu"><div class="dialog-card small"><button class="dialog-close" data-close aria-label="Close">×</button><p class="eyebrow">Add to the record</p><h2>What happened?</h2><div class="add-choices"><button data-action="add-asset"><span>01</span><b>Asset or system</b><small>Appliance, roof, boiler, panel</small></button><button data-action="add-event"><span>02</span><b>History event</b><small>Service, repair, permit, note</small></button><button data-action="add-task"><span>03</span><b>Next-due task</b><small>Seasonal or repeating work</small></button></div></div></dialog>
  <dialog id="form-dialog"><div class="dialog-card"><button class="dialog-close" data-close aria-label="Close">×</button><div id="dialog-form-content"></div></div></dialog>
  <dialog id="confirm-dialog"><form method="dialog" class="dialog-card small"><p class="eyebrow">Confirm change</p><h2 id="confirm-title">Delete this record?</h2><p id="confirm-copy"></p><div class="dialog-actions"><button class="button secondary" value="cancel">Keep record</button><button class="button danger-button" id="confirm-delete" value="confirm">Delete record</button></div></form></dialog>
  <dialog id="password-dialog"><form id="password-form" class="dialog-card small"><button type="button" class="dialog-close" data-close aria-label="Close">×</button><p class="eyebrow">Encrypted transfer</p><h2 id="password-title">Protect your full backup</h2><p id="password-copy">Use a password you can share separately. It cannot be recovered by us.</p><label>Backup password<input id="backup-password" name="password" type="password" minlength="8" autocomplete="new-password" required><small>At least 8 characters</small></label><p class="form-error" aria-live="assertive"></p><button class="button primary" type="submit">Encrypt and download</button></form></dialog>`;
}

function openForm(type: 'home' | 'asset' | 'event' | 'task' | 'license', id = ''): void {
  (document.querySelector('#record-menu') as HTMLDialogElement)?.close();
  const target = document.querySelector('#dialog-form-content')!;
  const asset = data.assets.find((item) => item.id === id);
  const event = data.events.find((item) => item.id === id);
  const task = data.tasks.find((item) => item.id === id);
  if (type === 'home') target.innerHTML = `<p class="eyebrow">Property identity</p><h2>${data.home ? 'Edit home details' : 'Set up your home'}</h2><p class="dialog-intro">Only a name is required. These details stay in this browser.</p><form id="home-form"><label>Home name <span>Required</span><input name="name" required maxlength="80" value="${escapeHtml(data.home?.name || '')}" placeholder="Our house"></label><label>Address <span>Optional</span><textarea name="address" rows="2" maxlength="240" placeholder="12 Oak Street, Town">${escapeHtml(data.home?.address || '')}</textarea></label><label>Year built <span>Optional</span><input name="yearBuilt" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" value="${escapeHtml(data.home?.yearBuilt || '')}"></label><p class="form-error" aria-live="assertive"></p><div class="dialog-actions"><button type="button" class="button secondary" data-close>Cancel</button><button class="button primary">Save home</button></div></form>`;
  if (type === 'asset') target.innerHTML = `<p class="eyebrow">Asset record</p><h2>${asset ? 'Edit asset' : 'Add an asset or system'}</h2><form id="asset-form" data-id="${asset?.id || ''}"><div class="form-grid"><label class="span-2">Name <span>Required</span><input name="name" required maxlength="100" value="${escapeHtml(asset?.name || '')}" placeholder="Water heater"></label><label>Category<input name="category" value="${escapeHtml(asset?.category || '')}" placeholder="Plumbing"></label><label>Location<input name="location" value="${escapeHtml(asset?.location || '')}" placeholder="Basement"></label><label>Make<input name="make" value="${escapeHtml(asset?.make || '')}"></label><label>Model<input name="model" value="${escapeHtml(asset?.model || '')}"></label><label>Serial number<input name="serial" value="${escapeHtml(asset?.serial || '')}"></label><label>Installed on<input name="installedOn" type="date" value="${asset?.installedOn || ''}"></label><label>Warranty until<input name="warrantyUntil" type="date" value="${asset?.warrantyUntil || ''}"></label><label class="span-2">Notes<textarea name="notes" rows="3">${escapeHtml(asset?.notes || '')}</textarea></label></div><p class="form-error" aria-live="assertive"></p><div class="dialog-actions"><button type="button" class="button secondary" data-close>Cancel</button><button class="button primary">Save asset</button></div></form>`;
  if (type === 'event') target.innerHTML = `<p class="eyebrow">History record</p><h2>${event ? 'Edit history' : 'Log service, repair, or permit'}</h2><form id="event-form" data-id="${event?.id || ''}"><div class="form-grid"><label>Record type<select name="kind"><option value="service" ${event?.kind === 'service' ? 'selected' : ''}>Service</option><option value="repair" ${event?.kind === 'repair' ? 'selected' : ''}>Repair</option><option value="permit" ${event?.kind === 'permit' ? 'selected' : ''}>Permit</option><option value="inspection" ${event?.kind === 'inspection' ? 'selected' : ''}>Inspection</option><option value="note" ${event?.kind === 'note' ? 'selected' : ''}>Contractor note</option></select></label><label>Date <span>Required</span><input name="date" type="date" required value="${event?.date || today()}"></label><label class="span-2">What happened? <span>Required</span><input name="title" required maxlength="140" value="${escapeHtml(event?.title || '')}" placeholder="Annual boiler service"></label><label>Related asset<select name="assetId">${options(event?.assetId)}</select></label><label>Contractor or authority<input name="contractor" value="${escapeHtml(event?.contractor || '')}" placeholder="Company or council"></label><label>Cost<input name="cost" type="number" min="0" step="0.01" value="${event?.cost ?? ''}" placeholder="0.00"></label><label>Evidence files<input name="files" type="file" multiple><small>Receipts, photos, manuals, or permit documents. Stored locally.</small></label><label class="span-2">Notes<textarea name="notes" rows="4" maxlength="2000">${escapeHtml(event?.notes || '')}</textarea></label></div><p class="form-error" aria-live="assertive"></p><div class="dialog-actions"><button type="button" class="button secondary" data-close>Cancel</button><button class="button primary">Save history</button></div></form>`;
  if (type === 'task') target.innerHTML = `<p class="eyebrow">Next-due work</p><h2>${task ? 'Edit task' : 'Add a maintenance task'}</h2><form id="task-form" data-id="${task?.id || ''}"><label>Task <span>Required</span><input name="title" required maxlength="140" value="${escapeHtml(task?.title || '')}" placeholder="Replace HVAC filter"></label><div class="form-grid"><label>Due date <span>Required</span><input name="dueDate" required type="date" value="${task?.dueDate || today()}"></label><label>Related asset<select name="assetId">${options(task?.assetId)}</select></label><label>Repeat every<input name="repeatMonths" type="number" min="1" max="120" value="${task?.repeatMonths ?? ''}" placeholder="3"><small>Months; leave blank for once</small></label></div><p class="form-error" aria-live="assertive"></p><div class="dialog-actions"><button type="button" class="button secondary" data-close>Cancel</button><button class="button primary">Save task</button></div></form>`;
  if (type === 'license') target.innerHTML = `<p class="eyebrow">Restore Pack Plus</p><h2>Use your purchase on this device</h2><p class="dialog-intro">Paste the license token from your purchase email. It is stored only in this browser.</p><form id="license-form"><label>License token<input name="license" required autocomplete="off" spellcheck="false"></label><p class="form-error" aria-live="assertive"></p><div class="dialog-actions"><button type="button" class="button secondary" data-close>Cancel</button><button class="button primary">Verify license</button></div></form>`;
  const dialog = document.querySelector<HTMLDialogElement>('#form-dialog')!;
  target.querySelectorAll<HTMLElement>('[data-close]').forEach((element) => element.addEventListener('click', () => dialog.close()));
  target.querySelector<HTMLFormElement>('form')?.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();
    await saveForm(submitEvent.currentTarget as HTMLFormElement);
  });
  dialog.showModal();
  queueMicrotask(() => target.querySelector<HTMLInputElement>('input, select, textarea')?.focus());
}

function showToast(message: string, action?: string): void {
  const toast = document.querySelector<HTMLDivElement>('#toast');
  if (!toast) return;
  toast.innerHTML = `${escapeHtml(message)}${action ? `<button data-action="reload">${escapeHtml(action)}</button>` : ''}`;
  toast.classList.add('show');
  if (!action) setTimeout(() => toast.classList.remove('show'), 3500);
}

function formError(form: HTMLFormElement, error: unknown): void {
  const el = form.querySelector<HTMLElement>('.form-error');
  if (el) el.textContent = error instanceof Error ? error.message : 'That could not be saved. Try again.';
}

async function saveForm(form: HTMLFormElement): Promise<void> {
  const values = new FormData(form);
  const stamp = now();
  try {
    if (form.id === 'home-form') {
      await put('home', { id: 'home', name: String(values.get('name')).trim(), address: String(values.get('address')).trim(), yearBuilt: String(values.get('yearBuilt')).trim(), updatedAt: stamp });
    } else if (form.id === 'asset-form') {
      const old = data.assets.find((item) => item.id === form.dataset.id);
      const item: Asset = { id: old?.id || uid(), name: String(values.get('name')).trim(), category: String(values.get('category')).trim(), location: String(values.get('location')).trim(), make: String(values.get('make')).trim(), model: String(values.get('model')).trim(), serial: String(values.get('serial')).trim(), installedOn: String(values.get('installedOn')), warrantyUntil: String(values.get('warrantyUntil')), notes: String(values.get('notes')).trim(), createdAt: old?.createdAt || stamp, updatedAt: stamp };
      await put('assets', item);
      packAssetIds.add(item.id);
    } else if (form.id === 'event-form') {
      const old = data.events.find((item) => item.id === form.dataset.id);
      const eventId = old?.id || uid();
      const attachments = [...(values.getAll('files') as File[])].filter((file) => file.size);
      const oversized = attachments.find((file) => file.size > 25 * 1024 * 1024);
      if (oversized) throw new Error(`${oversized.name} is over the 25 MB per-file limit. Choose a smaller file and try again.`);
      const attachmentIds = [...(old?.attachmentIds ?? [])];
      const newAttachments: Attachment[] = [];
      for (const file of attachments) {
        const fileItem: Attachment = { id: uid(), eventId, name: file.name, type: file.type || 'application/octet-stream', size: file.size, blob: file, createdAt: stamp };
        newAttachments.push(fileItem); attachmentIds.push(fileItem.id);
      }
      const costText = String(values.get('cost')).trim();
      const item: HistoryEvent = { id: eventId, assetId: String(values.get('assetId')), kind: String(values.get('kind')) as HistoryEvent['kind'], title: String(values.get('title')).trim(), date: String(values.get('date')), contractor: String(values.get('contractor')).trim(), cost: costText ? Number(costText) : null, notes: String(values.get('notes')).trim(), attachmentIds, createdAt: old?.createdAt || stamp, updatedAt: stamp };
      await putHistoryWithAttachments(item, newAttachments);
    } else if (form.id === 'task-form') {
      const old = data.tasks.find((item) => item.id === form.dataset.id);
      const repeat = String(values.get('repeatMonths')).trim();
      const item: Task = { id: old?.id || uid(), assetId: String(values.get('assetId')), title: String(values.get('title')).trim(), dueDate: String(values.get('dueDate')), repeatMonths: repeat ? Number(repeat) : null, complete: old?.complete ?? false, completedAt: old?.completedAt, createdAt: old?.createdAt || stamp, updatedAt: stamp };
      await put('tasks', item);
    } else if (form.id === 'license-form') {
      saveLicense(String(values.get('license')));
      const result = await verifyLicense(true);
      if (!result.valid) {
        if (result.offline) throw new Error('The license could not be verified. Reconnect and try again.');
        throw new Error('That license is not active for House History Pack. Check the token and try again.');
      }
      plus = true;
    }
    (document.querySelector('#form-dialog') as HTMLDialogElement).close();
    data = await loadData(); render(); showToast(form.id === 'license-form' ? 'Pack Plus restored.' : 'Saved to this device.');
  } catch (error) { formError(form, error); }
}

async function confirmDelete(kind: 'asset' | 'event' | 'task', id: string): Promise<void> {
  const item = kind === 'asset' ? data.assets.find((v) => v.id === id) : kind === 'event' ? data.events.find((v) => v.id === id) : data.tasks.find((v) => v.id === id);
  if (!item) return;
  const dialog = document.querySelector<HTMLDialogElement>('#confirm-dialog')!;
  document.querySelector('#confirm-title')!.textContent = `Delete “${kind === 'asset' ? (item as Asset).name : (item as HistoryEvent | Task).title}”?`;
  document.querySelector('#confirm-copy')!.textContent = kind === 'asset' ? 'Its history will remain as whole-property records. This cannot be undone.' : 'This cannot be undone. Attached evidence is also removed with a history record.';
  dialog.showModal();
  const result = await new Promise<string>((resolve) => dialog.addEventListener('close', () => resolve(dialog.returnValue), { once: true }));
  if (result !== 'confirm') return;
  if (kind === 'event') {
    const event = item as HistoryEvent;
    await Promise.all(event.attachmentIds.map((fileId) => remove('attachments', fileId)));
  }
  if (kind === 'asset') {
    for (const event of data.events.filter((v) => v.assetId === id)) await put('events', { ...event, assetId: '', updatedAt: now() });
    for (const task of data.tasks.filter((v) => v.assetId === id)) await put('tasks', { ...task, assetId: '', updatedAt: now() });
  }
  await remove(kind === 'asset' ? 'assets' : kind === 'event' ? 'events' : 'tasks', id);
  data = await loadData(); render(); showToast('Record deleted.');
}

function packOptions() {
  const form = document.querySelector<HTMLFormElement>('#pack-form')!;
  const values = new FormData(form);
  const assetIds = values.getAll('asset').map(String);
  packAssetIds = new Set(assetIds);
  return { assetIds, includeGeneral: values.has('general'), includeTasks: values.has('tasks'), includeAttachments: values.has('attachments'), title: String(values.get('packTitle') || `${data.home?.name || 'Home'} history pack`), handoverNote: String(values.get('handoverNote') || '') };
}

async function exportPack(kind: 'pdf' | 'zip'): Promise<void> {
  const options = packOptions();
  if (!options.assetIds.length && !options.includeGeneral) { showToast('Select an asset or include whole-property records.'); return; }
  showToast(`Building your ${kind.toUpperCase()} locally…`);
  try {
    const { createPdf, createZip } = await import('./exporter');
    const base = safeFilename(data.home?.name || 'house-history');
    if (kind === 'pdf') {
      const bytes = await createPdf(data, options);
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      download(new Blob([copy], { type: 'application/pdf' }), `${base}-pack.pdf`);
    }
    else download(await createZip(data, options), `${base}-pack.zip`);
    showToast(`${kind.toUpperCase()} ready. Your records never left this device.`);
  } catch (error) { showToast(error instanceof Error ? error.message : 'The pack could not be created.'); }
}

async function toggleTask(id: string): Promise<void> {
  const task = data.tasks.find((item) => item.id === id); if (!task) return;
  const complete = !task.complete;
  await put('tasks', { ...task, complete, completedAt: complete ? now() : undefined, updatedAt: now() });
  if (complete && task.repeatMonths) {
    const due = new Date(`${task.dueDate}T12:00:00`); due.setMonth(due.getMonth() + task.repeatMonths);
    await put('tasks', { ...task, id: uid(), dueDate: due.toISOString().slice(0, 10), complete: false, completedAt: undefined, createdAt: now(), updatedAt: now() });
  }
  data = await loadData(); render(); showToast(complete ? (task.repeatMonths ? 'Completed. The next repeat is scheduled.' : 'Task completed.') : 'Task reopened.');
}

async function handleImport(file: File, password?: string): Promise<void> {
  try {
    const text = await file.text();
    let raw: { format?: string };
    try { raw = JSON.parse(text) as { format?: string }; }
    catch { throw new Error('This backup is not valid JSON. Choose a backup created by House History Pack.'); }
    if (raw.format === 'house-history-pack-encrypted' && !password) {
      pendingImport = file;
      document.querySelector('#password-title')!.textContent = 'Unlock this backup';
      document.querySelector('#password-copy')!.textContent = 'Enter the password used when this backup was created.';
      (document.querySelector('#password-form button[type="submit"]') as HTMLButtonElement).textContent = 'Unlock and import';
      (document.querySelector('#password-dialog') as HTMLDialogElement).showModal(); return;
    }
    const imported = raw.format === 'house-history-pack-encrypted' ? await decryptBackup(text, password || '') : fromPortable(raw);
    if (!window.confirm(`Import “${imported.home?.name || 'this house record'}” and replace the records currently on this device?`)) return;
    await replaceData(imported); data = await loadData(); packAssetIds = new Set(data.assets.map((asset) => asset.id)); render(); showToast('Backup imported. Your previous local record was replaced.');
  } catch (error) {
    if (password) throw error;
    showToast(error instanceof Error ? error.message : 'The backup could not be imported.');
  }
}

function setView(next: ViewName, push = true, moveFocus = true): void {
  view = next;
  const url = `${location.pathname}${location.search}#${next}`;
  if (push) history.pushState({ view: next }, '', url);
  render();
  syncRouteMetadata(next);
  if (moveFocus) {
    const heading = document.querySelector<HTMLElement>('h1');
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: 'start' });
    const announcer = document.querySelector<HTMLElement>('#route-announcer');
    if (announcer) announcer.textContent = `${VIEW_LABELS[next]} view`;
  }
}

function bindEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-view]').forEach((element) => element.addEventListener('click', (event) => {
    event.preventDefault(); setView(element.dataset.view as ViewName);
  }));
  document.querySelectorAll<HTMLElement>('[data-close]').forEach((element) => element.addEventListener('click', () => element.closest('dialog')?.close()));
  document.querySelectorAll<HTMLElement>('[data-action]').forEach((element) => element.addEventListener('click', async (event) => {
    const action = element.dataset.action; const id = element.dataset.id || '';
    if (element.matches('a')) return;
    if (action === 'quick-add') (document.querySelector('#record-menu') as HTMLDialogElement).showModal();
    if (action === 'try-demo') location.assign(demoUrl);
    if (action === 'reset-demo' && demoMode) {
      await replaceData(sampleData()); data = await loadData(); packAssetIds = new Set(data.assets.map((asset) => asset.id)); render(); showToast('Sample data reset.');
    }
    if (action === 'start-real' && demoMode) { await discardCurrentDatabase(); location.assign('/'); }
    if (action === 'setup-home' || action === 'settings') openForm('home');
    if (action === 'add-asset' || action === 'edit-asset') openForm('asset', id);
    if (action === 'add-event' || action === 'edit-event') openForm('event', id);
    if (action === 'add-task' || action === 'edit-task') openForm('task', id);
    if (action === 'restore-license') openForm('license');
    if (action === 'delete-asset') await confirmDelete('asset', id);
    if (action === 'delete-event') await confirmDelete('event', id);
    if (action === 'delete-task') await confirmDelete('task', id);
    if (action === 'toggle-task') { event.preventDefault(); await toggleTask(id); }
    if (action === 'download-file') { const file = data.attachments.find((item) => item.id === id); if (file) download(file.blob, file.name); }
    if (action === 'select-all') { packAssetIds = new Set(data.assets.map((asset) => asset.id)); render(); }
    if (action === 'select-none') { packAssetIds.clear(); render(); }
    if (action === 'export-pdf') await exportPack('pdf');
    if (action === 'export-zip') await exportPack('zip');
    if (action === 'save-preset') {
      const options = packOptions(); data.settings = { ...data.settings, customPackTitle: options.title, handoverNote: options.handoverNote, presetAssetIds: options.assetIds, updatedAt: now() }; await put('settings', data.settings); showToast('Pack Plus settings saved.');
    }
    if (action === 'encrypted-backup') {
      pendingImport = null; document.querySelector('#password-title')!.textContent = 'Protect your full backup'; document.querySelector('#password-copy')!.textContent = 'Use a password you can share separately. It cannot be recovered by us.'; (document.querySelector('#password-form button[type="submit"]') as HTMLButtonElement).textContent = 'Encrypt and download'; (document.querySelector('#password-dialog') as HTMLDialogElement).showModal();
    }
    if (action === 'json-backup') {
      const portable = await toPortable(data);
      download(new Blob([JSON.stringify(portable, null, 2)], { type: 'application/json' }), `${safeFilename(data.home?.name || 'house-history')}-backup.json`);
      showToast('JSON backup ready. It is not encrypted, so store it privately.');
    }
    if (action === 'import') {
      const input = document.querySelector<HTMLInputElement>('#import-file')!;
      input.value = '';
      input.click();
    }
    if (action === 'reload') {
      const registration = await navigator.serviceWorker?.getRegistration();
      if (registration?.waiting) {
        navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else location.reload();
    }
  }));
  document.querySelectorAll<HTMLFormElement>('form:not([method="dialog"]):not(#pack-form):not(#password-form)').forEach((form) => form.addEventListener('submit', async (event) => { event.preventDefault(); await saveForm(form); }));
  document.querySelector<HTMLFormElement>('#password-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const passwordDialog = form.closest('dialog') as HTMLDialogElement; const password = String(new FormData(form).get('password'));
    try {
      if (pendingImport) { await handleImport(pendingImport, password); pendingImport = null; }
      else { const blob = await encryptBackup(data, password); download(blob, `${safeFilename(data.home?.name || 'house-history')}-encrypted.hhpack`); showToast('Encrypted backup ready. Keep its password separately.'); }
      passwordDialog.close(); form.reset();
    } catch (error) { formError(form, error); }
  });
  document.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', async (event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    try { if (file) await handleImport(file); }
    finally { input.value = ''; }
  });
  document.querySelector<HTMLFormElement>('#pack-form')?.addEventListener('change', () => { packAssetIds = new Set(new FormData(document.querySelector<HTMLFormElement>('#pack-form')!).getAll('asset').map(String)); });
}

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    watchForServiceWorkerUpdate(registration, () => Boolean(navigator.serviceWorker.controller), () => showToast('A new version is ready.', 'Reload'));
    navigator.serviceWorker.addEventListener('message', (event) => { if (event.data?.type === 'APP_UPDATED') showToast('House History Pack was updated.', 'Reload'); });
  } catch { /* The app still works without installation support. */ }
}

async function init(): Promise<void> {
  setStorageNamespace(demoMode ? 'demo' : 'real');
  acceptReturnedLicense(); plus = cachedUnlock();
  const hash = location.hash.slice(1) as ViewName; if (['overview', 'assets', 'history', 'tasks', 'pack'].includes(hash)) view = hash;
  try {
    data = await loadData();
    if (demoMode && !data.home) { await replaceData(sampleData()); data = await loadData(); }
    packAssetIds = new Set(data.settings.presetAssetIds.length ? data.settings.presetAssetIds : data.assets.map((asset) => asset.id));
    render();
    syncRouteMetadata(view);
  }
  catch {
    app.innerHTML = `<main id="main" class="fatal"><h1>Your home record could not open.</h1><p>This browser blocked local storage. Check private-browsing or site-storage settings, then reload.</p><button id="retry-open" class="button primary">Try again</button></main>`;
    document.querySelector('#retry-open')?.addEventListener('click', () => location.reload());
    return;
  }
  void verifyLicense().then((result) => {
    const prior = plus;
    plus = result.valid;
    if (prior !== plus) render();
    if (!result.valid && result.reason === 'unverified') showToast('Connect once to verify this Pack Plus license.');
    else if (!result.valid && result.reason && result.reason !== 'missing') showToast('Pack Plus license is no longer active. Your records remain available.');
  });
  window.addEventListener('online', () => { online = true; render(); showToast('Back online. Local records stayed available.'); });
  window.addEventListener('offline', () => { online = false; render(); showToast('You’re offline. Everything saved locally still works.'); });
  window.addEventListener('popstate', () => {
    const next = location.hash.slice(1) as ViewName;
    setView(Object.hasOwn(VIEW_LABELS, next) ? next : 'overview', false);
  });
  await registerServiceWorker();
}

void init();
