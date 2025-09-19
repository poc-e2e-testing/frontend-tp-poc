import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginForm } from '../../../pages/LoginForm';
import { Navbar } from '../../../pages/Navbar';
import { StorePage } from '../../../pages/StorePage';
import { ProductForm } from '../../../pages/ProductForm';
import { ProductCard } from '../../../pages/ProductCard';
import usuarios from '../../../fixtures/usuarios.json' with { type: 'json' };
import products from '../../../fixtures/product.json' with { type: 'json' };

const filePath = path.resolve(process.cwd(), 'playwright/fixtures/cafe.jpg');

test('Flujo E2E completo Don Julio Cafe', async ({ page }) => {
  const nombreProducto = `Café Dorado ${Math.floor(Math.random() * 100000)}`;
  const loginForm = new LoginForm(page);
  const navbar = new Navbar(page);
  const storePage = new StorePage(page);

  test.setTimeout(60000);

  // --- LOGIN ---
  await test.step('Login como admin', async () => {
    await loginForm.goto();
    await loginForm.login(
      usuarios.validos.admin.email,
      usuarios.validos.admin.password
    );
    await expect(page).toHaveURL(/.*store/);
  });

  // --- NAVEGACIÓN ---
  await test.step('Navegar por secciones', async () => {
    await navbar.goToTienda();
    await expect(page).toHaveURL(/.*store/);

    await navbar.misOrdenesLink.click();
    await expect(page).toHaveURL(/.*my-orders/);

    await navbar.adminPanelLink.click();
    await expect(page).toHaveURL(/.*adm-store/);

    await navbar.goToInicio();
    await expect(page).toHaveURL((url) => url.pathname === '/');

    await navbar.nosotrosLink.click();
    await expect(page).toHaveURL(/.*about/);
  });

  // --- FILTROS TIENDA ---
  await test.step('Validar filtros en tienda', async () => {
    await page.goto('/store');

    await storePage.searchFor(products.premium.nombre);
    await expect(
      storePage.getProductCards().filter({ hasText: products.premium.nombre })
    ).toHaveCount(1);

    await storePage.sortByPrice('asc');
    const ascPrices = await storePage.getProductPrices();
    for (let i = 1; i < ascPrices.length; i++) {
      expect(ascPrices[i]).toBeGreaterThanOrEqual(ascPrices[i - 1]);
    }

    await storePage.movePriceSliderTo(20);
    await page.waitForTimeout(500);
    await expect(
      storePage.getProductCards().filter({ hasText: products.hacienda.nombre })
    ).toHaveCount(0);
  });

  // --- CRUD DE PRODUCTO ---
  await test.step('Crear producto', async () => {
    const form = new ProductForm(page);
    await page.goto('/adm-store');
    await form.fillForm({
      nombre: nombreProducto,
      descripcion: 'Café tostado premium',
      precio: '500',
      stock: '10',
      brand: 'Don Julio Premium',
      productClass: 'Granos',
      filePath,
    });
    await form.expectPreviewVisible();
    await form.submitNewAndExpectSuccess();
  });

  await test.step('Editar producto', async () => {
    await page.goto('/adm-store');
    const card = new ProductCard(page, nombreProducto);
    await card.expectVisible();
    await card.clickEdit();

    await expect(page.getByText('Producto cargado para editar')).toBeVisible();

    const form = new ProductForm(page);
    await form.fillForm({
      precio: '600',
      brand: 'Don Julio Premium',
      productClass: 'Granos',
      filePath,
    });
    await form.expectPreviewVisible();
    await form.submitUpdateAndExpectSuccess();
  });

  await test.step('Eliminar producto', async () => {
    await page.goto('/adm-store');
    const producto = new ProductCard(page, nombreProducto);
    await producto.expectVisible();
    await producto.clickDelete();
    await producto.confirmDelete();

    await page.goto('/adm-store');
    const productoEliminado = new ProductCard(page, nombreProducto);
    await expect(productoEliminado.root).toHaveCount(0);
  });

  // --- LOGOUT ---
  await test.step('Cerrar sesión', async () => {
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
});