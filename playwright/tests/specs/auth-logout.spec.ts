import { test, expect } from '@playwright/test';
import { AuthHelpers } from '../../utils/auth-helpers';
import users from '../../fixtures/users.json' assert { type: 'json' };

test.describe('Logout - Funcionalidades de cierre de sesión', () => {
  let authHelpers: AuthHelpers;
  const admin = users.admin;
  const cliente = users.cliente;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
  });

  test('Logout exitoso desde la interfaz', async ({ page }) => {
    // Realizar login previo
    await authHelpers.loginUi(admin.email, admin.password);
    
    // Verificar que el usuario está logueado - usar selector genérico para el saludo
    await expect(page.getByText(/👋 Hola,/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
    
    // Realizar logout desde la UI
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    
    // Verificar redirección a login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Verificar que el localStorage se limpia completamente al usar logout desde UI
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const user = await page.evaluate(() => localStorage.getItem('user'));
    const clientEmail = await page.evaluate(() => localStorage.getItem('clientEmail'));
    expect(token).toBeNull();
    expect(user).toBeNull();
    // Test que valida que clientEmail también debe limpiarse en logout UI
    expect(clientEmail).toBeNull();
    
    // Verificar que la UI refleja el estado de deslogueado
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).not.toBeVisible();
  });

  test('Logout programático limpia estado correctamente', async ({ page }) => {
    // Realizar login con el cliente
    await authHelpers.loginUi(cliente.email, cliente.password);
    
    // Verificar login exitoso
    await authHelpers.verifyLoggedIn();
    await expect(page.getByText(/👋 Hola,/)).toBeVisible();
    
    // Ejecutar logout programático
    await authHelpers.logout();
    
    // Navegar a cualquier página para activar los listeners de React
    await page.goto('/store');
    await page.waitForLoadState('domcontentloaded');
    
    // Verificar que el estado se limpió correctamente
    await authHelpers.verifyLoggedOut();
    
    // Verificar que la UI refleja el cambio de estado
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible();
    await expect(page.getByText(/👋 Hola,/)).not.toBeVisible();
  });

  test('Rutas privadas inaccesibles después del logout forzado', async ({ page }) => {
    // Login inicial con admin para acceso completo
    await authHelpers.loginUi(admin.email, admin.password);
    await authHelpers.verifyLoggedIn();
    
    // Verificar acceso inicial a ruta protegida
    await page.goto('/my-orders');
    await expect(page).toHaveURL(/.*\/my-orders/);
    await expect(page.getByRole('heading', { name: 'Mis Órdenes' })).toBeVisible();
    
    // Verificar acceso a ruta de admin
    await page.goto('/adm-store');
    await expect(page).toHaveURL(/.*\/adm-store/);
    await expect(page.getByRole('heading', { name: 'Store' })).toBeVisible();
    
    // Logout forzado (simulando expiración de token)
    await authHelpers.logout();
    
    // Intentar acceder a ruta privada - debe redirigir a login
    await page.goto('/my-orders');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
    
    // Intentar acceder a ruta de admin - debe mostrar acceso denegado
    await page.goto('/adm-store');
    await expect(page).toHaveURL(/.*\/adm-store/);
    await expect(page.getByRole('heading', { name: '🚫 Acceso Denegado' })).toBeVisible();
    await expect(page.getByText('No tenés permisos para acceder a esta página.')).toBeVisible();
    
    // Verificar otra ruta de admin también
    await page.goto('/manage');
    await expect(page).toHaveURL(/.*\/manage/);
    await expect(page.getByRole('heading', { name: '🚫 Acceso Denegado' })).toBeVisible();
    await expect(page.getByText('No tenés permisos para acceder a esta página.')).toBeVisible();
    
    // Verificar que checkout también está protegido
    await page.goto('/checkout');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
  });

  test('Logout es consistente entre navegadores', async ({ page }) => {
    // Login con usuario cliente
    await authHelpers.loginUi(cliente.email, cliente.password);
    
    // Verificar estado inicial
    await authHelpers.verifyLoggedIn();
    const initialToken = await page.evaluate(() => localStorage.getItem('token'));
    expect(initialToken).toBeTruthy();
    
    // Simular logout desde otro navegador/pestaña
    await page.evaluate(() => {
      // Simula el efecto de otro navegador limpiando el localStorage
      localStorage.clear();
      // Dispara evento para notificar el cambio
      window.dispatchEvent(new Event('storage'));
    });
    
    // Navegar para activar verificaciones de autenticación
    await page.goto('/store');
    await page.waitForLoadState('domcontentloaded');
    
    // Verificar que la aplicación detectó el cambio de estado
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible();
    
    // Intentar acceder a ruta protegida
    await page.goto('/my-orders');
    await expect(page).toHaveURL(/.*\/login/);
    
    // Verificar que el localStorage está realmente limpio
    await authHelpers.verifyLoggedOut();
  });
});