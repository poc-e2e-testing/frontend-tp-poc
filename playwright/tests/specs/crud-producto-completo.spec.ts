import { test, expect } from '@playwright/test';
import path from 'path';
import { Navbar } from '../../pages/Navbar';
import { ProductForm } from '../../pages/ProductForm';
import { ProductCard } from '../../pages/ProductCard';

const filePath = path.resolve(process.cwd(), 'playwright/fixtures/cafe.jpg');

//Te hace un test cuando termina el otro
test.describe.configure({ mode: 'serial' });

test.describe('CRUD de productos como admin', () => {
  let nombreProducto: string;

  test.beforeAll(() => {
    // Generar nombre 
    nombreProducto = `Café Dorado ${Math.floor(Math.random() * 100000)}`;
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    const navbar = new Navbar(page);
    await expect(navbar.welcomeMessage).toBeVisible();
  });

  test('1. Crear producto', async ({ page }) => {
    await test.step('Iniciar sesión como admin', async () => {

    });
    await test.step('Ir al panel de administración', async () => {
      const navbar = new Navbar(page);
      await expect(navbar.adminPanel).toBeVisible();
      await navbar.goToAdminPanel();
    });

    await test.step('Crear nuevo producto', async () => {
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
    });

    // Verificar que el producto fue creado
    await test.step('Verificar producto creado', async () => {
      await page.goto('http://localhost:5173/adm-store');
      const productoCreado = page.locator('div.card', { hasText: nombreProducto });
      await expect(productoCreado).toBeVisible();
      await expect(productoCreado).toContainText(/500/);
    });
  });

  test('2. Editar producto', async ({ page }) => {
 await test.step('Editar producto existente', async () => {
      await page.goto('http://localhost:5173/adm-store');
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

    await test.step('Verificar producto editado', async () => {
      await page.goto('http://localhost:5173/adm-store');
      const card = new ProductCard(page, nombreProducto);
      await card.expectVisible();
      await card.expectPrice(/600/);
    });
  });

  test('3. Eliminar producto', async ({ page }) => {
     await test.step('Eliminar producto', async () => {
      await page.goto('http://localhost:5173/adm-store');
      const producto = new ProductCard(page, nombreProducto);
      await producto.expectVisible();
      await producto.expectPrice(/600/);

      await producto.clickDelete();
      await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
      const eliminarBtn = page
        .getByRole('dialog')
        .getByRole('button', { name: 'Eliminar' });
      await eliminarBtn.waitFor({ state: 'visible' });
      await eliminarBtn.click({ force: true });
      await expect(
        page.getByText('Producto eliminado correctamente')
      ).toBeVisible();
    });

    await test.step('Verificar producto eliminado', async () => {
      await page.goto('http://localhost:5173/adm-store');
      const productoEliminado = new ProductCard(page, nombreProducto);
      await expect(productoEliminado.root).toHaveCount(0);
    });
  });
});