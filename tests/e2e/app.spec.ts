import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('creates a home record with evidence and exports a selected PDF', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/House History Pack/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your home, documented.');

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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your home, documented.');
  await expect(page.getByText('Offline & ready')).toBeVisible();
  await context.setOffline(false);
});

test('@claim:demo-isolated Sample data is one click, isolated, and resettable', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
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
  await page.getByRole('button', { name: 'Build pack' }).first().click();
  await expect(page.getByRole('heading', { name: 'Build a portable history pack' })).toBeVisible();
  expect(requestUrls.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
});

test('@claim:portable-exports Demo creates a PDF and a ZIP with its evidence', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Build pack' }).first().click();
  const pdfDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Create PDF' }).click();
  expect((await pdfDownload).suggestedFilename()).toBe('juniper-house-pack.pdf');

  const zipDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Create ZIP + evidence' }).click();
  expect((await zipDownload).suggestedFilename()).toBe('juniper-house-pack.zip');
  await expect(page.getByText('ZIP ready. Your records never left this device.')).toBeVisible();
});

test('@claim:encrypted-backup Demo creates a password-protected backup envelope', async ({ page }) => {
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
});

test('@claim:pack-plus-price Demo shows the one-time Pack Plus price and leaves exports available', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Build pack' }).first().click();
  await expect(page.getByText('One-time purchase, $29.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create PDF' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Create ZIP + evidence' })).toBeEnabled();
});

test('the demo has no serious or critical axe violations', async ({ page }) => {
  await page.goto('/demo');
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
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
