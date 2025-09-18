import { test, expect } from '@playwright/test';
import usuarios from '../../fixtures/usuarios.json' assert { type: 'json' };
const filePath = 'playwright/fixtures/cafe.jpg';

const nombreProducto = `Café Dorado ${Math.floor(Math.random() * 100000)}`;

test('test', async ({ page }) => {
  test.setTimeout(40000);
  //Ir a la pagina principal
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  //Panel de administracion
  const botonAdmin = page.getByRole('link', { name: 'Panel Admin' });
  await expect(botonAdmin).toBeVisible();
  await botonAdmin.click();
  const pageTitleAdmin = page.getByRole('heading', { name: 'Store' });
  await expect(pageTitleAdmin).toBeVisible();

  //Creacion del producto
  await page.getByRole('textbox', { name: 'Nombre' }).fill(nombreProducto);
  await page.getByRole('textbox', { name: 'Descripción' }).fill('Café tostado premium');
  await page.getByPlaceholder('Precio').fill('500');
  await page.getByPlaceholder('Stock').fill('10');
  await page.locator('select[name="productBrand"]').selectOption({ label: 'Don Julio Premium' });
  await page.locator('select[name="productClass"]').selectOption({ label: 'Granos' });
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await expect(page.getByRole('img', { name: 'Vista previa' })).toBeVisible();
  await page.getByRole('button', { name: 'Agregar Producto' }).click();
  await expect(page.getByText('Producto agregado correctamente')).toBeVisible({ timeout: 10000 });

  //Edicion del producto
  await page.goto('http://localhost:5173/adm-store', { waitUntil: 'domcontentloaded' });
  const productoCard = page.locator('div.card', { hasText: nombreProducto });
  await productoCard.getByRole('button', { name: 'Editar' }).click();
  await expect(page.getByText('Producto cargado para editar')).toBeVisible();
  await page.getByPlaceholder('Precio').fill('600');
  await page.locator('select[name="productBrand"]').selectOption({ label: 'Don Julio Premium' });
  await page.locator('select[name="productClass"]').selectOption({ label: 'Granos' });
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await expect(page.getByRole('img', { name: 'Vista previa' })).toBeVisible();
  await page.getByRole('button', { name: 'Actualizar Producto' }).click();
  await expect(page.getByText('Producto actualizado correctamente')).toBeVisible({ timeout: 10000 });

  //Eliminacion del producto
  await page.goto('http://localhost:5173/adm-store', { waitUntil: 'domcontentloaded' });
  const productoEditado = page.locator('div.card', { hasText: nombreProducto });
  await expect(productoEditado).toBeVisible();
  await expect(productoEditado).toContainText(/600/);
  await productoEditado.getByRole('button', { name: 'Eliminar' }).click();
  const eliminarBtn = page.getByRole('dialog').getByRole('button', { name: 'Eliminar' });
  await expect(eliminarBtn).toBeVisible({ timeout: 10000 });
  await eliminarBtn.click();
  await expect(page.getByText('Producto eliminado correctamente')).toBeVisible({ timeout: 10000 });
  await page.goto('http://localhost:5173/');
});
