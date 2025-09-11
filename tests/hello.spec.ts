import { test, expect } from '@playwright/test';

test('hola mundo: la página carga', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
