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

  test('Debería filtrar los productos correctamente al usar el buscador de texto', async ({ page }) => {
    // Datos de prueba
    const productoPremium = 'Don Julio Premium Granos 500g';
    const productoHacienda = 'Hacienda Del Valle Molido 250g';
    const terminoBusqueda = 'Premium';

    // 1. Acción: En Playwright, `fill` es ideal porque primero borra el campo y luego escribe.
    await page.getByPlaceholder('Buscar productos').fill(terminoBusqueda);  
    await page.getByRole('button', { name: 'Buscar' }).click();

    // 2. Aserción de Sincronización (¡LA CLAVE!):
    // Esperamos a que el resultado del filtro esté completo. Sabemos que solo debe quedar 1 tarjeta.
    await expect(page.locator('.card')).toHaveCount(1);

    // 3. Aserción Final: Ahora que sabemos que el filtro se aplicó, verificamos el contenido.
    await expect(page.locator('.card', { hasText: productoPremium })).toBeVisible();
    await expect(page.locator('.card', { hasText: productoHacienda })).toBeHidden();
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

  test('Deberia filtrar por rango de precios usando el slider',async ({page})=>{
const productoPremium = 'Don Julio Premium Granos 500g';
  const productoHacienda = 'Hacienda Del Valle Molido 250g';

  // 1. Acción: Mover el manejador izquierdo del slider hacia la derecha para subir el precio minimo a 2000 o más.
  const sliderHandle = page.locator('.rc-slider-handle').first();

  // Opción 1: Simulación de teclado (como en el ejemplo de Cypress)
  await sliderHandle.click();
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowRight');
  }

  
  // Opción 2: Arrastrar y soltar (una alternativa más directa en Playwright)
// Para arrastrar, necesitamos un "objetivo" hacia donde moverlo.
  // Usualmente, el propio riel del slider funciona bien como objetivo.
/*   const sliderTrack = page.locator('.rc-slider'); 

  // La acción clave: arrastra el manejador (handle) hacia el riel (track).
  // Playwright calculará las coordenadas.
  await sliderHandle.dragTo(sliderTrack, {
    // Le indicamos que el punto de destino en el riel debe ser
    // más a la derecha del punto de origen del manejador.
    // Prueba ajustando `x`. Un valor más alto lo moverá más lejos.
    targetPosition: { x: 150, y: 0 } 
  }); */

  // 2. Aserción de Sincronización: Esperamos a que el texto del rango se actualice.
  // Usamos `expect.poll` para re-evaluar la condición hasta que se cumpla o se agote el tiempo.
  // Esto es muy útil para esperar cambios en la UI que dependen de eventos.
  await expect(page.locator('.card')).toHaveCount(1, { timeout: 10000 });

  // 3. Verificaciones: Comprobar que el producto más barato no exista y el más caro sea visible.
  await expect(page.locator('.card', { hasText: productoHacienda })).toBeHidden();
  await expect(page.locator('.card', { hasText: productoPremium })).toBeVisible();
  })
});