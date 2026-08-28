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
