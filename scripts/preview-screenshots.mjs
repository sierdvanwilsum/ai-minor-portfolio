import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('test-results/preview', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
for (const [name, width, path] of [
  ['home-desktop', 1440, '/'],
  ['home-mobile', 390, '/'],
  ['minor-desktop', 1440, '/ai-minor'],
  ['minor-mobile', 390, '/ai-minor#sprint-1'],
]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(`http://127.0.0.1:5173${path}`);
  await page.evaluate(() => document.fonts.ready);
  for (const photo of await page.locator('main img').all()) {
    if (!await photo.isVisible()) continue;
    await photo.scrollIntoViewIfNeeded();
    await photo.evaluate(img => (img.complete ? Promise.resolve() : new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    })));
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `test-results/preview/${name}.png`, fullPage: true });
}
await browser.close();
console.log('Screenshots opgeslagen in test-results/preview/');
