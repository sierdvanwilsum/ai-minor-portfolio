import { test, expect, type Page } from '@playwright/test';
import { defaultContent } from '../src/data/siteContent';

const user = { id: 'c77cf341-d38d-4c39-b2e2-e5b06bc65f43', aud: 'authenticated', role: 'authenticated', email: 'admin@example.test', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const token = `${Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')}.${Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600, role: 'authenticated' })).toString('base64url')}.test`;

async function mockBackend(page: Page, options: { admin?: boolean; failure?: boolean; existing?: boolean; conflict?: boolean } = {}) {
  let row = options.existing ? { content: structuredClone(defaultContent), version: 1 } : null;
  let writes = 0;
  await page.route('https://portfolio-test.supabase.co/**', async route => {
    const request = route.request();
    const url = request.url();
    if (url.includes('/auth/v1/token')) return route.fulfill({ json: { access_token: token, refresh_token: 'test-refresh-token', expires_in: 3600, token_type: 'bearer', user } });
    if (url.includes('/auth/v1/logout')) return route.fulfill({ status: 204 });
    if (url.includes('/portfolio_admins')) return route.fulfill({ json: options.admin === false ? null : { user_id: user.id } });
    if (url.includes('/portfolio_content')) {
      if (options.failure) return route.fulfill({ status: 404, json: { code: 'PGRST205' } });
      if (request.method() === 'GET') return route.fulfill({ json: row });
      writes++;
      if (options.conflict) return route.fulfill({ status: 406, json: { code: 'PGRST116' } });
      row = { content: request.postDataJSON().content, version: row ? row.version + 1 : 1 };
      return route.fulfill({ json: row });
    }
    if (url.includes('/storage/v1/object/')) return route.fulfill({ json: { Key: 'portfolio-media/test.png' } });
    return route.fulfill({ json: user });
  });
  return { get row() { return row; }, get writes() { return writes; } };
}
async function login(page: Page) {
  await page.goto('/');
  if ((page.viewportSize()?.width || 1280) <= 760) await page.getByRole('button', { name: 'Menu +' }).click();
  await page.getByRole('navigation', { name: 'Hoofdnavigatie' }).getByRole('link', { name: 'Admin', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Admin inloggen', exact: true })).toBeVisible();
  await page.getByLabel('E-mailadres', { exact: true }).fill(user.email);
  await page.getByLabel('Wachtwoord', { exact: true }).fill('test-password-not-a-real-account');
  await page.getByRole('button', { name: 'Inloggen', exact: true }).click();
}

test('Beheerder publiceert inhoud die zichtbaar wordt op de website', async ({ page }) => {
  const backend = await mockBackend(page);
  await login(page);
  await expect(page.getByRole('button', { name: 'Opslaan en publiceren' })).toBeEnabled();
  await page.getByLabel('Naam', { exact: true }).fill('Sierd Testnaam');
  await page.getByRole('button', { name: 'Opslaan en publiceren' }).click();
  await expect(page.getByText('Opgeslagen en gepubliceerd.', { exact: true })).toBeVisible();
  expect(backend.row?.content.profile.name).toBe('Sierd Testnaam');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('TESTNAAM');
  await page.goto('/admin');
  await expect(page.getByRole('button', { name: 'Uitloggen', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Uitloggen', exact: true }).click();
  await expect(page.getByLabel('Wachtwoord', { exact: true })).toBeVisible();
});

test('Een ingelogde gebruiker zonder adminrechten krijgt geen formulier', async ({ page }) => {
  await mockBackend(page, { admin: false });
  await login(page);
  await expect(page.getByText('Dit account heeft geen beheerdersrechten.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Opslaan en publiceren' })).toHaveCount(0);
});

test('Ontbrekende database blokkeert opslaan, maar behoudt de publieke website', async ({ page }) => {
  await mockBackend(page, { failure: true });
  await login(page);
  await expect(page.getByRole('button', { name: 'Opslaan en publiceren' })).toBeDisabled();
  await expect(page.getByText(/De databasetabellen ontbreken/)).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('SIERD');
});

test('Verouderde opslag geeft een melding en behoudt de invoer', async ({ page }) => {
  await mockBackend(page, { existing: true, conflict: true });
  await login(page);
  await page.getByLabel('Naam', { exact: true }).fill('Niet verliezen');
  await page.getByRole('button', { name: 'Opslaan en publiceren' }).click();
  await expect(page.getByRole('alert')).toContainText('intussen gewijzigd');
  await expect(page.getByLabel('Naam', { exact: true })).toHaveValue('Niet verliezen');
});

test('Ongeldige voortgang en gevaarlijke links worden niet gepubliceerd', async ({ page }) => {
  const backend = await mockBackend(page);
  await login(page);
  await page.getByLabel('LinkedIn-adres').fill('javascript:alert(1)');
  await page.getByRole('button', { name: 'Opslaan en publiceren' }).click();
  await expect(page.getByRole('alert')).toContainText('https://');
  expect(backend.writes).toBe(0);
  await page.getByLabel('LinkedIn-adres').fill('');
  await page.getByRole('button', { name: 'LU-voortgang', exact: true }).click();
  await page.locator('.admin-item summary').first().click();
  await page.getByLabel('Behaald', { exact: true }).first().fill('99');
  await page.getByRole('button', { name: 'Opslaan en publiceren' }).click();
  await expect(page.getByRole('alert')).toContainText('niet hoger');
  expect(backend.writes).toBe(0);
});

test('Showcase toevoegen en een PDF uploaden op mobiel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const backend = await mockBackend(page);
  await login(page);
  await page.getByRole('button', { name: 'Sprints & showcases', exact: true }).click();
  await page.locator('.admin-item>summary').filter({ hasText: /^Sprint 2$/ }).click();
  const sprint = page.locator('.admin-item').filter({ has: page.locator('summary', { hasText: /^Sprint 2$/ }) }).first();
  await sprint.getByRole('button', { name: 'Toevoegen aan showcases +' }).click();
  const showcase = sprint.locator('.admin-item').first();
  await showcase.locator('summary').first().click();
  await showcase.getByLabel('Titel', { exact: true }).fill('Nieuwe showcase');
  await showcase.getByRole('button', { name: 'Toevoegen aan documenten +' }).click();
  const document = showcase.locator('.admin-item').last();
  await document.locator('summary').click();
  await document.locator('input[type=file]').setInputFiles({ name: 'bewijs.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n%%EOF') });
  await expect(document.getByLabel('Adres of bestand', { exact: true })).toHaveValue(/storage\/v1\/object\/public/);
  await page.getByRole('button', { name: 'Opslaan en publiceren' }).click();
  await expect(page.getByText('Opgeslagen en gepubliceerd.', { exact: true })).toBeVisible();
  expect(backend.row?.content.sprints[1].showcases[0].title).toBe('Nieuwe showcase');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
