import { test, expect } from '@playwright/test';

/**
 * Verifica que el título de la página contenga "Playwright".
 * @param {{ page: import('@playwright/test').Page }} param0
 */
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

/**
 * Test: Navega con el enlace Get started y verifica el encabezado Installation.
 * @param {{ page: import('@playwright/test').Page }} param0
 */
test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(
    page.getByRole('heading', { name: 'Installation' })
  ).toBeVisible();
});
