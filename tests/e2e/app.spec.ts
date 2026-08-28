import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';

test('creates a home record with evidence and exports a selected PDF', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/House History Pack/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keep your home history ready to share.');

  await page.getByRole('button', { name: 'Set up your home' }).click();
  await page.getByLabel(/Home name/).fill('Maple House');
  await page.getByLabel(/Address/).fill('12 Maple Lane');
  await page.getByRole('button', { name: 'Save home' }).click();
  await expect(page.locator('.address')).toContainText('12 Maple Lane');

  await page.getByRole('button', { name: 'Assets' }).first().click();
  await page.getByRole('button', { name: 'Add asset' }).click();
  await page.getByLabel(/Name/).fill('Water heater');
  await page.getByLabel('Category').fill('Plumbing');
  await page.getByLabel('Location').fill('Basement');
  await page.getByLabel('Warranty until').fill('2028-08-28');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await expect(page.getByRole('heading', { name: 'Water heater' })).toBeVisible();

  await page.getByRole('button', { name: 'History' }).first().click();
  await page.getByRole('button', { name: 'Log history' }).click();
  await page.getByLabel(/What happened/).fill('Annual safety service');
  await page.getByLabel('Related asset').selectOption({ label: 'Water heater' });
  await page.getByLabel('Contractor or authority').fill('Local Heating Co');
  await page.getByLabel('Evidence files').setInputFiles('tests/fixtures/service-receipt.txt');
  await page.getByRole('button', { name: 'Save history' }).click();
  await expect(page.getByRole('heading', { name: 'Annual safety service' })).toBeVisible();
  await expect(page.getByRole('button', { name: /service-receipt/ })).toBeVisible();

  await page.getByRole('button', { name: 'Build pack' }).first().click();
  await expect(page.getByLabel(/Water heater/)).toBeChecked();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Create PDF' }).click();
  const downloaded = await downloadPromise;
  expect(downloaded.suggestedFilename()).toBe('maple-house-pack.pdf');

  if (testInfo.project.name === 'chromium') {
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }
});

test('reloads the application shell while offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keep your home history ready to share.');
  await expect(page.getByText('Offline & ready')).toBeVisible();
  await context.setOffline(false);
});

test('@claim:browser-local-storage Real records stay in browser storage and the demo cannot change them', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Set up your home' }).click();
  await page.getByLabel(/Home name/).fill('Cedar House');
  await page.getByRole('button', { name: 'Save home' }).click();
  await expect(page.getByText('Cedar House', { exact: true })).toBeVisible();

  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — House History Pack');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('Juniper House', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add record' }).click();
  await page.getByRole('button', { name: /Asset or system/ }).click();
  await page.getByLabel('Name Required').fill('Demo-only boiler');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await page.getByRole('button', { name: 'Assets' }).first().click();
  await expect(page.getByRole('heading', { name: 'Demo-only boiler' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Demo-only boiler' })).not.toBeVisible();

  const storage = await page.evaluate(async () => {
    const homeName = await new Promise<string | null>((resolve, reject) => {
      const request = indexedDB.open('house-history-pack');
      request.onsuccess = () => {
        const get = request.result.transaction('home').objectStore('home').get('home');
        get.onsuccess = () => resolve((get.result as { name?: string } | undefined)?.name ?? null);
        get.onerror = () => reject(get.error);
      };
      request.onerror = () => reject(request.error);
    });
    return { homeName, names: (await indexedDB.databases()).map((database) => database.name) };
  });
  expect(storage.homeName).toBe('Cedar House');
  expect(storage.names).toEqual(expect.arrayContaining(['house-history-pack', 'demo:house-history-pack']));

  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('Cedar House', { exact: true })).toBeVisible();
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databases).not.toContain('demo:house-history-pack');
});

test('@claim:demo-isolated Sample data is one click, isolated, and resettable', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: 'Assets' }).first().click();
  await expect(page.getByRole('heading', { name: 'Water heater' })).toBeVisible();
  const databaseNames = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databaseNames).toContain('demo:house-history-pack');
  const realHomeCount = await page.evaluate(async () => new Promise<number>((resolve, reject) => {
    const request = indexedDB.open('house-history-pack');
    request.onsuccess = () => {
      const tx = request.result.transaction('home');
      const count = tx.objectStore('home').count();
      count.onsuccess = () => resolve(count.result);
      count.onerror = () => reject(count.error);
    };
    request.onerror = () => reject(request.error);
  }));
  expect(realHomeCount).toBe(0);

  await page.getByRole('button', { name: 'Add record' }).click();
  await page.getByRole('button', { name: /Asset or system/ }).click();
  await page.getByLabel('Name Required').fill('Temporary demo asset');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await expect(page.getByRole('heading', { name: 'Temporary demo asset' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Sample data reset.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Temporary demo asset' })).not.toBeVisible();
  await expect(page.getByText('Water heater warranty')).toBeVisible();
});

test('@claim:offline-reload Demo works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.getByText('Water heater warranty')).toBeVisible();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('Water heater warranty')).toBeVisible();
  await context.setOffline(false);
});

test('@claim:local-only Demo records do not send data off this origin', async ({ page }) => {
  const requestUrls: string[] = [];
  page.on('request', (request) => requestUrls.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add record' }).click();
  await page.getByRole('button', { name: /Next-due task/ }).click();
  await page.getByLabel('Task Required').fill('Check sump pump');
  await page.getByRole('button', { name: 'Save task' }).click();
  await expect(page.getByText('Check sump pump')).toBeVisible();
  await page.getByRole('button', { name: 'Build pack' }).first().click();
  for (const name of ['Create PDF', 'Create ZIP + evidence']) {
    const downloaded = page.waitForEvent('download');
    await page.getByRole('button', { name }).click();
    await downloaded;
  }
  expect(requestUrls.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
});

test('@claim:portable-exports Demo creates a PDF and a ZIP with its evidence', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Build pack' }).first().click();
  const pdfDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Create PDF' }).click();
  const pdf = await pdfDownload;
  expect(pdf.suggestedFilename()).toBe('juniper-house-pack.pdf');
  const pdfPath = await pdf.path();
  expect(pdfPath).not.toBeNull();
  expect((await readFile(pdfPath!)).subarray(0, 5).toString()).toBe('%PDF-');

  const zipDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Create ZIP + evidence' }).click();
  const zipFile = await zipDownload;
  expect(zipFile.suggestedFilename()).toBe('juniper-house-pack.zip');
  const zipPath = await zipFile.path();
  expect(zipPath).not.toBeNull();
  const zip = await JSZip.loadAsync(await readFile(zipPath!));
  expect(Object.keys(zip.files)).toEqual(expect.arrayContaining([
    'house-history-report.pdf', 'records.json', 'README.txt',
    'evidence/heater-service-northline-service-receipt.txt'
  ]));
  expect(await zip.file('evidence/heater-service-northline-service-receipt.txt')!.async('text')).toContain('Invoice 1048');
  await expect(page.getByText('ZIP ready. Your records never left this device.')).toBeVisible();
});

test('@claim:encrypted-backup Demo backup rejects a wrong password and restores with the right one', async ({ page }) => {
  await page.addInitScript(() => {
    const original = URL.createObjectURL.bind(URL);
    const store = window as Window & { __downloadBlobs?: Blob[] };
    store.__downloadBlobs = [];
    URL.createObjectURL = (blob: Blob) => { store.__downloadBlobs?.push(blob); return original(blob); };
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Build pack' }).first().click();
  await page.getByRole('button', { name: 'Encrypted full backup' }).click();
  await page.getByLabel('Backup password').fill('demo-password');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Encrypt and download' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('juniper-house-encrypted.hhpack');
  expect(await file.failure()).toBeNull();
  const envelope = await page.evaluate(async () => {
    const blobs = (window as Window & { __downloadBlobs?: Blob[] }).__downloadBlobs ?? [];
    return JSON.parse(await blobs.at(-1)!.text()) as { format: string; kdf: string; iterations: number; data: string };
  });
  expect(envelope).toMatchObject({ format: 'house-history-pack-encrypted', kdf: 'PBKDF2-SHA256', iterations: 250000 });
  expect(envelope.data).not.toContain('Juniper House');
  await expect(page.getByText('Encrypted backup ready. Keep its password separately.')).toBeVisible();
  await expect(page.locator('#password-dialog')).not.toHaveAttribute('open', '');

  const backupPath = await file.path();
  expect(backupPath).not.toBeNull();

  await page.locator('#import-file').setInputFiles(backupPath!);
  await expect(page.getByRole('heading', { name: 'Unlock this backup' })).toBeVisible();
  await page.getByLabel('Backup password').fill('wrong-password');
  await page.getByRole('button', { name: 'Unlock and import' }).click();
  await expect(page.locator('#password-dialog .form-error')).toContainText('password did not unlock');
  await page.locator('#password-dialog [data-close]').click();

  // Selecting the same file must fire again after a failed attempt.
  await page.locator('#import-file').setInputFiles(backupPath!);
  await expect(page.getByRole('heading', { name: 'Unlock this backup' })).toBeVisible();
  await page.getByLabel('Backup password').fill('demo-password');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Unlock and import' }).click();
  await expect(page.getByText('Backup imported. Your previous local record was replaced.')).toBeVisible();
  await page.getByRole('button', { name: 'Assets' }).first().click();
  await expect(page.getByRole('heading', { name: 'Water heater' })).toBeVisible();
});

test('@claim:pack-plus-price Demo shows the one-time Pack Plus price and leaves exports available', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Pack Plus is $29 once for custom cover text and saved pack settings')).toBeVisible();
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Build pack' }).first().click();
  await expect(page.getByText('One-time purchase, $29.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create PDF' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Create ZIP + evidence' })).toBeEnabled();
});

test('@claim:maintenance-tracking Warranty dates and repeating maintenance remain visible', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Assets' }).first().click();
  await expect(page.getByText('Apr 19, 2032', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Tasks' }).first().click();
  await expect(page.getByText('Repeats every 3 months')).toBeVisible();
  await page.getByRole('checkbox', { name: /Replace heat-pump filter/ }).click();
  await expect(page.getByText('Completed. The next repeat is scheduled.')).toBeVisible();
  await expect(page.getByText('Repeats every 3 months')).toHaveCount(2);
});

test('@claim:no-account-tracking Demo uses no account, analytics, ads, cloud sync, CDN font, or tracking request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'History' }).first().click();
  await expect(page.getByRole('heading', { name: 'Service, repairs & permits' })).toBeVisible();
  expect(requests.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
  expect(await page.locator('script[src^="http"], link[rel="stylesheet"][href^="http"], link[rel="preload"][href^="http"]').count()).toBe(0);
  expect(await page.getByLabel(/email|account|sign in/i).count()).toBe(0);
});

test('@claim:license-verification Unverified Pack Plus tokens stay locked when verification is unavailable or rate limited', async ({ page, context }) => {
  await page.route('https://api.sociobot.in/**', (route) => route.fulfill({ status: 429, body: '{}' }));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Build pack' }).first().click();
  await page.getByRole('button', { name: 'Have a license? Restore it' }).click();
  await page.getByLabel('License token').fill('not-a-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#license-form .form-error')).toContainText('could not be verified');
  await expect(page.getByLabel('Pack title')).toHaveCount(0);

  await page.locator('#form-dialog .dialog-close').click();
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Have a license? Restore it' }).click();
  await page.getByLabel('License token').fill('still-not-a-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#license-form .form-error')).toContainText('could not be verified');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:house-history-pack:verdict'))).toBeNull();
  await context.setOffline(false);
});

test('mixed oversized evidence is rejected without leaving an orphaned file', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'The 25 MB boundary needs one browser execution.');
  await page.goto('/demo');
  await expect(page.getByText('Water heater warranty')).toBeVisible();
  const countAttachments = () => page.evaluate(async () => new Promise<number>((resolve, reject) => {
    const request = indexedDB.open('demo:house-history-pack');
    request.onsuccess = () => {
      const count = request.result.transaction('attachments').objectStore('attachments').count();
      count.onsuccess = () => resolve(count.result);
      count.onerror = () => reject(count.error);
    };
    request.onerror = () => reject(request.error);
  }));
  expect(await countAttachments()).toBe(1);
  await page.getByRole('button', { name: 'History' }).first().click();
  await page.getByRole('button', { name: 'Log history' }).click();
  await page.getByLabel('What happened? Required').fill('Mixed evidence upload');
  await page.getByLabel('Evidence files').setInputFiles([
    { name: 'small.txt', mimeType: 'text/plain', buffer: Buffer.from('private') },
    { name: 'too-large.bin', mimeType: 'application/octet-stream', buffer: Buffer.alloc(25 * 1024 * 1024 + 1) }
  ]);
  await page.getByRole('button', { name: 'Save history' }).click();
  await expect(page.locator('#event-form .form-error')).toContainText('over the 25 MB per-file limit');
  expect(await countAttachments()).toBe(1);
});

test('backup errors are plain and importing remains available at 390px', async ({ page }, testInfo) => {
  await page.goto('/demo');
  await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Import backup' })).toBeVisible();
  if (testInfo.project.name === 'mobile') {
    const box = await page.getByRole('button', { name: 'Import backup' }).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await page.locator('#import-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
  await expect(page.getByText('This backup is not valid JSON. Choose a backup created by House History Pack.')).toBeVisible();
});

test('section navigation preserves history, moves focus, and announces the view', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Assets' }).first().click();
  await expect(page).toHaveURL(/#assets$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.getByRole('button', { name: 'History' }).first().click();
  await expect(page).toHaveURL(/#history$/);
  await page.goBack();
  await expect(page).toHaveURL(/#assets$/);
  await expect(page.getByRole('heading', { name: 'Assets & systems' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Assets view');
});

test('direct demo serves its own metadata without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto('http://127.0.0.1:4173/demo');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle('Demo — House History Pack');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://house-history-pack.sociobot.in/demo');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Demo — House History Pack');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://house-history-pack.sociobot.in/demo');
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Demo — House History Pack');
  await context.close();
});

test('public routes have complete titles, aligned social metadata, touch targets, and install links', async ({ page }) => {
  const routes = [
    ['/', 'House History Pack — Keep home history ready', 'https://house-history-pack.sociobot.in/'],
    ['/?demo=1', 'Demo — House History Pack', 'https://house-history-pack.sociobot.in/demo'],
    ['/demo', 'Demo — House History Pack', 'https://house-history-pack.sociobot.in/demo'],
    ['/privacy/', 'Privacy — House History Pack', 'https://house-history-pack.sociobot.in/privacy/'],
    ['/terms/', 'Terms — House History Pack', 'https://house-history-pack.sociobot.in/terms/'],
    ['/404.html', 'Page not found — House History Pack', 'https://house-history-pack.sociobot.in/404.html']
  ] as const;
  for (const [route, title, canonical] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-card\.jpg$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /social-card\.jpg$/);
  }
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://house-history-pack.sociobot.in/');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.json');
  const brand = await page.locator('.brand').boundingBox();
  expect(brand?.height).toBeGreaterThanOrEqual(44);
});

test('first actions and mobile first-screen facts stay clear of the fixed dock', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'chromium') {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keep your home history ready to share.');
    await expect(page.getByRole('heading', { name: 'How to make a house history pack' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Keep every home record together.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add your first home record' })).toBeVisible();
    for (const name of ['Try it with sample data', 'Set up your home']) {
      const box = await page.getByRole('button', { name }).boundingBox();
      expect(box, `${name} has a box`).not.toBeNull();
      expect(box!.y, `${name} starts in the first screen`).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height, `${name} ends in the first screen`).toBeLessThanOrEqual(720);
    }
  }

  if (testInfo.project.name === 'mobile') {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    const dock = await page.locator('.side-nav').boundingBox();
    expect(dock, 'fixed mobile dock has a box').not.toBeNull();
    const facts = page.locator('.hero-facts li');
    expect(await facts.count()).toBe(3);
    for (const fact of await facts.all()) {
      const box = await fact.boundingBox();
      expect(box, 'hero fact has a box').not.toBeNull();
      expect(box!.y, 'hero fact starts within the first screen').toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height, 'hero fact ends above the fixed dock').toBeLessThanOrEqual(dock!.y);
    }
    await page.goto('/demo');
    const namedControls = ['Reset demo', 'Start for real'];
    for (const name of namedControls) {
      const box = await page.getByRole('button', { name }).boundingBox();
      expect(box, `${name} has a box`).not.toBeNull();
      expect(box!.width, `${name} width`).toBeGreaterThanOrEqual(44);
      expect(box!.height, `${name} height`).toBeGreaterThanOrEqual(44);
    }
    const edits = page.getByRole('button', { name: 'Edit' });
    expect(await edits.count()).toBeGreaterThan(0);
    for (const edit of await edits.all()) {
      const box = await edit.boundingBox();
      expect(box, 'timeline edit has a box').not.toBeNull();
      expect(box!.width, 'timeline edit width').toBeGreaterThanOrEqual(44);
      expect(box!.height, 'timeline edit height').toBeGreaterThanOrEqual(44);
    }
  }
});

test('all public pages have no axe violations', async ({ page }) => {
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations, route).toEqual([]);
  }
});

test('keyboard reaches the skip link and closes a form with Escape', async ({ page }) => {
  await page.goto('/demo');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to main content')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('button', { name: 'Add record' }).click();
  await page.getByRole('button', { name: /Asset or system/ }).click();
  await expect(page.getByLabel('Name Required')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Name Required')).not.toBeVisible();
});
