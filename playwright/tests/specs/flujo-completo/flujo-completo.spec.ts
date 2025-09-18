import { test, expect } from '@playwright/test';
import { LoginForm } from '../../../pages/LoginForm';
import { getNavbar } from '../../../pages/Navbar';
import { StorePage } from '../../../pages/StorePage';
import { ProductForm } from '../../../pages/ProductForm';
import { ProductCard } from '../../../pages/ProductCard';
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
  await storePage.movePriceSliderTo(20);
  await page.waitForTimeout(500);
  await expect(storePage.getProductCards().filter({ hasText: products.hacienda.nombre })).toHaveCount(0);

  // --- CRUD DE PRODUCTO ---
    // Crear producto
    await navbar.adminPanelLink.click();
    await expect(navbar.welcomeMessage).toBeVisible();
    const form = new ProductForm(page);
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

    // Verificar que el producto fue creado
    await navbar.adminPanelLink.click();
    await expect(navbar.welcomeMessage).toBeVisible();

    const productoCreado = page.locator('div.card', { hasText: nombreProducto });
    await expect(productoCreado).toBeVisible();
    await expect(productoCreado).toContainText(/500/);

    // Editar producto
    await navbar.adminPanelLink.click();
    await expect(navbar.welcomeMessage).toBeVisible();

    const card = new ProductCard(page, nombreProducto);
    await card.expectVisible();
    await card.clickEdit();
    await expect(page.getByText('Producto cargado para editar')).toBeVisible();

    const formUpd = new ProductForm(page);
      await formUpd.fillForm({
        precio: '600',
        brand: 'Don Julio Premium',
        productClass: 'Granos',
        filePath,
      });
    await formUpd.expectPreviewVisible();
    await formUpd.submitUpdateAndExpectSuccess();
      
    await navbar.adminPanelLink.click();
    await expect(navbar.welcomeMessage).toBeVisible();

    //Verificar que el producto fue editado
    const cardCheck = new ProductCard(page, nombreProducto);
    await cardCheck.expectVisible();
    await cardCheck.expectPrice(/600/);

    //Eliminar producto
    await navbar.adminPanelLink.click();
    await expect(navbar.welcomeMessage).toBeVisible();
    const productoEliminar = new ProductCard(page, nombreProducto);
    await productoEliminar.expectVisible();
    await productoEliminar.expectPrice(/600/);
    
    await productoEliminar.clickDelete(); 
    await productoEliminar.confirmDelete();
    
    // Verificar producto eliminado
    //await navbar.adminPanelLink.click();
    //await expect(navbar.welcomeMessage).toBeVisible();
    page.reload()
    
    const productoEliminado = new ProductCard(page, nombreProducto);
    await expect(productoEliminado.root).toHaveCount(0);

  // --- LOGOUT ---
  await navbar.logoutButton.waitFor({ state: 'visible' });
  await navbar.clickLogout();
  await expect(page).toHaveURL(/.*login/);
  await expect(navbar.loginLink).toBeVisible();
  const token = await page.evaluate(() => localStorage.getItem('token'));
  const user = await page.evaluate(() => localStorage.getItem('user'));
  expect(token).toBeNull();
  expect(user).toBeNull();
});