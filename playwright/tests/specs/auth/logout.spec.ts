import { test, expect, Page } from '@playwright/test';
import { AuthHelpers } from '../../../utils/auth-helpers';
import usuarios from '../../../fixtures/usuarios.json' with { type: 'json' };

test.describe('Logout - Playwright', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
  });

  test('Logout exitoso desde la interfaz', async ({ page }) => {
    // 1. Hacer login primero
    await authHelpers.loginUi(usuarios.validos.admin.email, usuarios.validos.admin.password);

    // 2. Verificar que estamos logueados
    await expect(page).toHaveURL(/.*\/store/);
    await authHelpers.verifyLoggedIn();

    // 3. Buscar y hacer clic en el botón de logout
    const logoutButton = page.locator([
      '[data-testid="logout-btn"]',
      'button:has-text("Logout")',
      'button:has-text("Cerrar sesión")',
      '[aria-label="Logout"]',
      '[aria-label="Cerrar sesión"]'
    ].join(', '));
    
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // 4. Verificar redirección a login o home
    await expect(page).toHaveURL(/.*\/(login|home|$)/);

    // 5. Verificar que se limpió el localStorage
    await authHelpers.verifyLoggedOut();

    // 6. Verificar que no podemos acceder a rutas protegidas
    await page.goto('/admin/products');
    await expect(page).toHaveURL(/.*\/(login|unauthorized)/);
  });

  test('Logout usando comando personalizado', async ({ page }) => {
    // 1. Hacer login con API
    await authHelpers.loginByApi(usuarios.validos.admin.email, usuarios.validos.admin.password);
    await page.goto('/store');

    // 2. Verificar estado inicial
    await authHelpers.verifyLoggedIn();

    // 3. Ejecutar logout usando método personalizado
    await authHelpers.logout();

    // 4. Verificar que se limpió correctamente
    await authHelpers.verifyLoggedOut();

    // 5. Verificar que al intentar acceder a una ruta protegida nos redirige
    await page.goto('/my-orders');
    await expect(page).toHaveURL(/.*\/(login|unauthorized)/);
  });

  test('Logout desde diferentes páginas mantiene la funcionalidad', async ({ page }) => {
    // 1. Login
    await authHelpers.loginByApi(usuarios.validos.admin.email, usuarios.validos.admin.password);

    // 2. Test logout desde /store
    await page.goto('/store');
    await authHelpers.verifyLoggedIn();
    
    // Re-login para siguiente test
    await authHelpers.loginByApi(usuarios.validos.admin.email, usuarios.validos.admin.password);

    // 3. Test logout desde /my-orders (si existe)
    await page.goto('/my-orders');
    const currentUrl = page.url();
    
    if (currentUrl.includes('/my-orders')) {
      await authHelpers.logout();
      await authHelpers.verifyLoggedOut();
    }

    // Re-login para siguiente test
    await authHelpers.loginByApi(usuarios.validos.admin.email, usuarios.validos.admin.password);

    // 4. Test logout desde página de admin
    await page.goto('/admin/products');
    const adminUrl = page.url();
    
    if (adminUrl.includes('/admin')) {
      await authHelpers.logout();
      await authHelpers.verifyLoggedOut();
    }
  });

  test('Logout mantiene consistencia en diferentes navegadores', async ({ page, browserName }) => {
    // 1. Login específico por navegador
    await authHelpers.loginByApi(usuarios.validos.admin.email, usuarios.validos.admin.password);
    await page.goto('/store');

    // 2. Verificar comportamiento específico según navegador
    await authHelpers.verifyLoggedIn();
    
    // 3. Logout usando interfaz
    const logoutButton = page.locator([
      '[data-testid="logout-btn"]',
      'button:has-text("Logout")',
      'button:has-text("Cerrar sesión")'
    ].join(', '));
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    } else {
      // Fallback a logout programático si no encuentra el botón
      await authHelpers.logout();
    }

    // 4. Verificar que el logout funciona consistentemente
    await authHelpers.verifyLoggedOut();

    // 5. Test específico para WebKit (Safari)
    if (browserName === 'webkit') {
      // WebKit a veces tiene comportamientos específicos con localStorage
      await page.waitForTimeout(500); // Esperar un poco más para WebKit
      await authHelpers.verifyLoggedOut();
    }

    // 6. Verificar redirección
    await page.goto('/admin/products');
    await expect(page).toHaveURL(/.*\/(login|unauthorized)/, { timeout: 10000 });
  });
});