import { test, expect } from '@playwright/test';
import { LoginForm } from '../../../pages/LoginForm';
import { getNavbar } from '../../../pages/Navbar';
import { StorePage } from '../../../pages/StorePage';
import usuarios from '../../../fixtures/usuarios.json' with { type: 'json' };
import products from '../../../fixtures/product.json' with { type: 'json' };
const filePath = 'playwright/fixtures/cafe.jpg';


test('Flujo E2E completo Don Julio Cafe', async ({ page }) => {
  const nombreProducto = `Café Dorado ${Math.floor(Math.random() * 100000)}`;
  const loginForm = new LoginForm(page);
  const navbar = getNavbar(page);
  const storePage = new StorePage(page);
  test.setTimeout(60000);

  // --- LOGIN UI ---
  await loginForm.goto();
  await loginForm.login(
    usuarios.validos.admin.email,
    usuarios.validos.admin.password
  );
  await expect(page).toHaveURL(/.*store/);

  // --- NAVEGACIÓN ---
  await navbar.goToTienda();
  await expect(page).toHaveURL(/.*store/);
  await navbar.misOrdenesLink.click();
  await expect(page).toHaveURL(/.*my-orders/);

  await navbar.adminPanelLink.click()

  await expect(page).toHaveURL(/.*adm-store/);
  await navbar.goToInicio();
  await expect(page).toHaveURL((url) => url.pathname === '/');
  await navbar.nosotrosLink.click();
  await expect(page).toHaveURL(/.*about/);


  // --- VALIDACIÓN DE FILTROS EN TIENDA (POM + datos) ---
  await page.goto('/store');

  await storePage.searchFor(products.premium.nombre);
  await expect(storePage.getProductCards().filter({ hasText: products.premium.nombre })).toHaveCount(1);
  await storePage.sortByPrice('asc');
  const ascPrices = await storePage.getProductPrices();
  expect(ascPrices.length).toBeGreaterThan(0);
  for (let i = 1; i < ascPrices.length; i++) {
    expect(ascPrices[i]).toBeGreaterThanOrEqual(ascPrices[i - 1]);
  }
  await storePage.movePriceSliderTo(2000);
  await page.waitForTimeout(500);
  await expect(storePage.getProductCards().filter({ hasText: products.hacienda.nombre })).toHaveCount(0);



  // --- CRUD DE PRODUCTO ---
    // Crear producto
    await navbar.adminPanelLink.click();
    await page.getByRole('textbox', { name: 'Nombre' }).fill(nombreProducto);
    await page.getByRole('textbox', { name: 'Descripción' }).fill('Café tostado premium');
    await page.getByPlaceholder('Precio').fill('500');
    await page.getByPlaceholder('Stock').fill('10');
    await page.locator('select[name="productBrand"]').selectOption({ label: 'Don Julio Premium' });
    await page.locator('select[name="productClass"]').selectOption({ label: 'Granos' });
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await expect(page.getByRole('img', { name: 'Vista previa' })).toBeVisible();
    await page.getByRole('button', { name: 'Agregar Producto' }).click();
    await expect(page.getByText('Producto agregado correctamente')).toBeVisible();

    // Verificar que el producto fue creado
    await page.goto('/adm-store');
    const productoCreado = page.locator('div.card', { hasText: nombreProducto });
    await expect(productoCreado).toBeVisible();
    await expect(productoCreado).toContainText(/500/);

    // Editar producto
    await page.goto('/adm-store');
    const productoCard = page.locator('div.card', { hasText: nombreProducto });
    await expect(productoCard).toBeVisible();
    await productoCard.getByRole('button', { name: 'Editar' }).click();
    await expect(page.getByText('Producto cargado para editar')).toBeVisible();
    await page.getByPlaceholder('Precio').fill('600');
    await page.locator('select[name="productBrand"]').selectOption({ label: 'Don Julio Premium' });
    await page.locator('select[name="productClass"]').selectOption({ label: 'Granos' });
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await expect(page.getByRole('img', { name: 'Vista previa' })).toBeVisible();
    await page.getByRole('button', { name: 'Actualizar Producto' }).click();
    await expect(page.getByText('Producto actualizado correctamente')).toBeVisible();

    // Verificar producto editado
    await page.goto('/adm-store');
    const productoEditado = page.locator('div.card', { hasText: nombreProducto });
    await expect(productoEditado).toBeVisible();
    await expect(productoEditado).toContainText(/600/);

    // Eliminar producto
    await page.goto('/adm-store');
    const producto = page.locator('div.card', { hasText: nombreProducto });
    await expect(producto).toBeVisible();
    await expect(producto).toContainText(/600/);
    await producto.getByRole('button', { name: 'Eliminar' }).click();
    const eliminarBtn = page.getByRole('dialog').getByRole('button', { name: 'Eliminar' });
    await eliminarBtn.waitFor({ state: 'visible' });
    await eliminarBtn.click({ force: true });

    // Verificar producto eliminado
    await page.goto('/adm-store');
    const productoEliminado = page.locator('div.card', { hasText: nombreProducto });
    await expect(productoEliminado).toHaveCount(0);

  // --- LOGOUT ---
  await page.goto('/adm-store');
  await navbar.logoutButton.waitFor({ state: 'visible' });
  await navbar.clickLogout();
  await expect(page).toHaveURL(/.*login/);
  await expect(navbar.loginLink).toBeVisible();
  const token = await page.evaluate(() => localStorage.getItem('token'));
  const user = await page.evaluate(() => localStorage.getItem('user'));
  expect(token).toBeNull();
  expect(user).toBeNull();
});