import { test, expect } from '@playwright/test';
import users from '../../fixtures/users.json' assert { type: 'json' };

const filePath = 'playwright/fixtures/cafe.jpg';

const nombreProducto = `Café Dorado ${Math.floor(Math.random() * 100000)}`;
const admin = users.admin;

test('test', async ({ page }) => {
  //Ir a la pagina principal
  test.setTimeout(60000);
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('Bienvenido a Don Julio Cafe')).toBeVisible();

  //Inicio de sesion
  await page.getByRole('link', { name: 'Iniciar sesión' }).click();
  await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(admin.email);
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill(admin.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('link', { name: 'Panel Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Panel Admin' }).click();
  await expect(page.getByRole('heading', { name: 'Store' })).toBeVisible();


  //Creacion del producto
  await page.getByRole('textbox', { name: 'Nombre' }).click();
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
  

  //Edicion del producto
  await page.goto('http://localhost:5173/adm-store');
  const productoCard = page.locator('div.card', { hasText: nombreProducto });
  await productoCard.getByRole('button', { name: 'Editar' }).click();
  await expect(page.getByText('Producto cargado para editar')).toBeVisible();
  await page.getByPlaceholder('Precio').fill('600');
  await page.locator('select[name="productBrand"]').selectOption({ label: 'Don Julio Premium' });
  await page.locator('select[name="productClass"]').selectOption({ label: 'Granos' });
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await expect(page.getByRole('img', { name: 'Vista previa' })).toBeVisible();
  await page.getByRole('button', { name: 'Actualizar Producto' }).click();
  await expect(page.getByText('Producto actualizado correctamente')).toBeVisible();

  //Eliminacion del producto
  await page.goto('http://localhost:5173/adm-store');
  const productoEditado = page.locator('div.card', { hasText: nombreProducto });
  await expect(productoEditado).toBeVisible();
  await expect(productoEditado).toContainText(/600/)
  
  await productoEditado.getByRole('button', { name: 'Eliminar' }).click();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  const eliminarBtn = page.getByRole('dialog').getByRole('button', { name: 'Eliminar' });
  await eliminarBtn.waitFor({ state: 'visible'});
  await eliminarBtn.click({ force: true });
  await expect(page.getByText('Producto eliminado correctamente')).toBeVisible();

  //Cerrar sesion
  await page.goto('http://localhost:5173/adm-store');
  await page.getByRole('button', { name: 'Cerrar sesión' }).click({ force: true });
  await page.goto('http://localhost:5173/');
});