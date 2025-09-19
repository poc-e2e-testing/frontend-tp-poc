import { test, expect } from '@playwright/test';

/**
 * Test: Verifica que la página principal carga correctamente.
 * @param {{ page: import('@playwright/test').Page }} param0
 */
test('hola mundo: la página carga', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
