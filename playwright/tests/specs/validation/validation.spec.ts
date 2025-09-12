import { test, expect } from '@playwright/test';

// Importamos los datos de los usuarios. La sintaxis `with { type: 'json' }` es la forma moderna de hacerlo.
import usuarios from '../../../fixtures/usuarios.json' with { type: 'json' };

test.describe('Pruebas de Filtros en la Tienda - Playwright', () => {

  test.beforeEach(async ({ page }) => {
    // Playwright usa `async/await` para todas sus operaciones.
    // Visitamos la página de la tienda antes de cada test.
    await page.goto('/store');
    // Nos aseguramos de que los productos iniciales se hayan cargado.
    // Playwright esperará automáticamente a que este elemento sea visible.
    await expect(page.locator('.card').first()).toBeVisible({ timeout: 10000 });
  });

  test('Debería ordenar los productos por precio de menor a mayor', async ({ page }) => {
    // 1. Acción: Seleccionamos la opción 'asc' en el dropdown.
    await page.locator('select#order').selectOption('asc');

    // Esperamos un momento a que la UI se reordene.
    await page.waitForTimeout(500);

    // 2. Aserción: En Playwright, no necesitamos un `wait` manual.
    // La herramienta esperará automáticamente a que la acción de ordenar termine
    // antes de ejecutar el siguiente comando.
    
    // Obtenemos todos los textos de los precios de las tarjetas visibles.
    const priceTexts = await page.locator('.card:visible .ms-2.text-muted').allTextContents();
    
    // Convertimos los textos a números.
    const prices = priceTexts.map(text => parseFloat(text.replace(/[$,]/g, '')));
    
    // Creamos una copia ordenada del array para comparar.
    const sortedPrices = [...prices].sort((a, b) => a - b);
    
    // Verificamos que los arrays son idénticos.
    expect(prices).toEqual(sortedPrices);
  });

  test('Debería ordenar los productos por precio de mayor a menor', async ({ page }) => {
    // 1. Acción: Seleccionar la opción 'desc'.
    await page.locator('select#order').selectOption('desc');

    // Esperamos un momento a que la UI se reordene.
    await page.waitForTimeout(500);

    // 2. Aserción: Repetimos la misma lógica pero para orden descendente.
    const priceTexts = await page.locator('.card:visible .ms-2.text-muted').allTextContents();
    const prices = priceTexts.map(text => parseFloat(text.replace(/[$,]/g, '')));
    const sortedPrices = [...prices].sort((a, b) => b - a);
    
    expect(prices).toEqual(sortedPrices);
  });

});