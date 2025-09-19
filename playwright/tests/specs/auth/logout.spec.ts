import { test, expect } from '@playwright/test';
import { AuthUtils } from '../../../utils/AuthUtils';
import { Navbar } from '../../../pages/Navbar';
import usuarios from '../../../fixtures/usuarios.json' assert { type: 'json' };

/**
 * Tests de logout: cierre de sesión desde la UI y gestión del estado de sesión.
 */
test.describe('Flujo de Logout', () => {
  let authUtils: AuthUtils;
  let navbar: Navbar;

  test.beforeEach(async ({ page }) => {
    authUtils = new AuthUtils(page);
    navbar = new Navbar(page);
  });

  test.describe('Cierre de sesión desde la interfaz de usuario', () => {
    test.use({ storageState: 'storageState.json' });

    /**
     * Test: Logout desde la UI limpia el estado de sesión.
     * @param {{ page: import('@playwright/test').Page }} param0
     */
    test('debería limpiar completamente el estado de la sesión al hacer logout desde la UI', async ({ page }) => {
      await page.goto('/store');
      await expect(navbar.logoutButton).toBeVisible();

      await navbar.clickLogout();

      await expect(page).toHaveURL(/.*\/login/);

      const token = await page.evaluate(() => localStorage.getItem('token'));
      const user = await page.evaluate(() => localStorage.getItem('user'));
      expect(token, 'El token debe ser nulo').toBeNull();
      expect(user, 'El usuario debe ser nulo').toBeNull();

      const clientEmail = await page.evaluate(() =>
        localStorage.getItem('clientEmail')
      );
      expect(clientEmail, 'El clientEmail debe ser nulo').toBeNull();
    });

    /**
     * Test: Logout redirige al login y actualiza la UI.
     * @param {{ page: import('@playwright/test').Page }} param0
     */
    test('debería redirigir al login y actualizar la UI para un usuario deslogueado', async ({ page }) => {
      await page.goto('/store');
      await navbar.clickLogout();

      await expect(page).toHaveURL(/.*\/login/);
      await expect(navbar.loginLink).toBeVisible();
      await expect(navbar.logoutButton).not.toBeVisible();
    });
  });

  test.describe('Gestión del estado de la sesión', () => {
    /**
     * Test: Logout programático limpia el estado de sesión.
     * @param {{ page: import('@playwright/test').Page }} param0
     */
    test('el logout programático debe limpiar todo el estado de la sesión', async ({ page }) => {
      await authUtils.loginByApi(
        usuarios.validos.client.email,
        usuarios.validos.client.password
      );
      await page.goto('/my-orders');

      await authUtils.logout();

      await authUtils.verifyLoggedOut();
    });

    /**
     * Test: Logout si el localStorage se limpia externamente.
     * @param {{ page: import('@playwright/test').Page }} param0
     */
    test('debería desloguear al usuario si el localStorage se limpia externamente', async ({ page }) => {
      await authUtils.loginByApi(
        usuarios.validos.client.email,
        usuarios.validos.client.password
      );
      await page.goto('/store');
      await expect(navbar.logoutButton).toBeVisible();

      await page.evaluate(() => localStorage.clear());
      await page.reload();

      await expect(navbar.loginLink).toBeVisible();
      await expect(navbar.logoutButton).not.toBeVisible();
    });
  });
});
