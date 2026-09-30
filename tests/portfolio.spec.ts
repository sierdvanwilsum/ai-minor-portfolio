import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://portfolio-test.supabase.co/**', route => route.fulfill({ json: [] }));
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`Pagina's en navigatie op ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('SIERD');
    await expect(page.locator('.project')).toHaveCount(4);
    await expect(page.locator('.experience')).toHaveCount(5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    if (width <= 760) {
      await page.getByRole('button', { name: 'Menu +' }).click();
      await expect(page.getByRole('navigation')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('navigation')).toBeHidden();
      await page.getByRole('button', { name: 'Menu +' }).click();
    }
    await page.getByRole('navigation').getByRole('link', { name: 'AI Minor' }).click();
    await expect(page).toHaveURL('/ai-minor');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Future-proof');
    await expect(page.locator('details')).toHaveCount(8);
    await expect(page.locator('details[open]')).toHaveCount(0);
    await expect(page.getByRole('progressbar')).toHaveCount(5);
    const progress = await page.locator('progress').evaluateAll(elements => elements.map(el => [(el as HTMLProgressElement).value, (el as HTMLProgressElement).max]));
    expect(progress).toEqual([[1, 2], [0, 4], [0, 2], [1, 4], [1, 6]]);
    await page.locator('#sprint-1 summary').click();
    await expect(page.locator('#sprint-1 .showcase')).toHaveCount(3);
    await expect(page.getByRole('heading', { name: 'AI-impact op eventproductie', exact: true })).toBeVisible();
    await page.locator('#sprint-2 summary').click();
    await expect(page.locator('details[open]')).toHaveCount(2);
    await expect(page.getByText('Codex leren gebruiken', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.locator('#sprint-1 summary').click();
    await expect(page.locator('#sprint-1')).not.toHaveAttribute('open', '');
    for (let i = 3; i <= 8; i++) {
      await page.locator(`#sprint-${i} summary`).click();
      await expect(page.locator(`#sprint-${i} .sprint-empty`)).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test('Directe showcase-link en toetsenbordbediening', async ({ page }) => {
  await page.goto('/ai-minor#sprint-1');
  await expect(page.locator('#sprint-1')).toHaveAttribute('open', '');
  await page.locator('#sprint-1 summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#sprint-1')).not.toHaveAttribute('open', '');
  await page.keyboard.press('Space');
  await expect(page.locator('#sprint-1')).toHaveAttribute('open', '');
  await page.reload();
  await expect(page.locator('#sprint-1')).toHaveAttribute('open', '');
});

test('Ontbrekende afbeeldingen krijgen een nette fallback', async ({ page }) => {
  await page.route('**/images/profile/sierd-portret.png', route => route.abort());
  await page.goto('/');
  await expect(page.getByRole('img', { name: 'Portret volgt' })).toBeVisible();
  await expect(page.locator('.contact-pending')).toHaveCount(0);
  await expect(page.locator('a[href=""], a[href="#"]')).toHaveCount(0);
});

test('Portret, voetbal en projectfoto’s laden op mobiel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const gallery of await page.locator('.project-gallery summary').all()) {
    await gallery.click();
  }
  const photos = page.locator('main img');
  await expect(photos).toHaveCount(10);
  for (const photo of await photos.all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toBeVisible();
    await expect.poll(() => photo.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await expect(page.getByRole('heading', { name: 'Een eigen diner bij LOFI', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('Contactlinks en CV werken en de introductie is opgeruimd', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('.hero-portrait img')).toHaveAttribute('src', '/images/profile/sierd-portret.png');
  await expect(page.locator('.portrait-stamp')).toHaveCount(0);
  await expect(page.getByText('Van idee naar uitvoering', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Periode nog toe te voegen', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'E-mail', exact: true })).toHaveAttribute('href', 'mailto:Sierdvanwilsum@gmail.com');
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', 'https://www.linkedin.com/in/sierd-van-wilsum-9378b1240/');
  const cv = page.getByRole('link', { name: 'Curriculum vitae', exact: true });
  await expect(cv).toHaveAttribute('target', '_blank');
  const response = await request.get((await cv.getAttribute('href'))!);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
});
