import { test, expect } from '@playwright/test';
import { LoginForm } from '../../../pages/LoginForm';
import usuarios from '../../../fixtures/usuarios.json' with { type: 'json' };

test.describe('Flujo de Login - Playwright', () => {

  test('Login exitoso con usuario válido', async ({ page }) => {
    const loginForm = new LoginForm(page);

    // 1. Ir a la página de login
    await loginForm.goto();

    // 2. Completar formulario con datos de usuario válido usando el método del POM
    await loginForm.login(
      usuarios.validos.admin.email,
      usuarios.validos.admin.password
    );

    // 3. Verificar redirección a la tienda
    await expect(page).toHaveURL(/.*store/);

    // 4. Verificar que el token de autenticación se guarda en localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('Login falla con email incorrecto', async ({ page }) => {
    const loginForm = new LoginForm(page);

    // 1. Ir a la página de login
    await loginForm.goto();

    // 2. Completar formulario con email incorrecto
    await loginForm.login(
      usuarios.invalidos.emailIncorrecto.email,
      usuarios.invalidos.emailIncorrecto.password
    );

    // 3. Verificar que la URL no ha cambiado
    await expect(page).toHaveURL(/.*login/);

    // 4. Verificar que se muestra el mensaje de error apropiado usando el locator del POM
    await expect(page.locator('text=Cliente no encontrado')).toBeVisible()
  });
});