import { test, expect } from '@playwright/test';
import productos from '../../../fixtures/product.json' assert { type: 'json' };
import { Navbar } from '../../../pages/Navbar';
import { StorePage } from '../../../pages/StorePage';

test.describe('Pruebas de Filtros en la Tienda - Playwright', () => {
  let navbar: Navbar;
  let storePage: StorePage;

  test.beforeEach(async ({ page }) => {
    navbar = new Navbar(page);
    storePage = new StorePage(page);
    // Playwright usa `async/await` para todas sus operaciones.
    // Visitamos la página de la tienda antes de cada test.
    await page
      .goto('/store');
    // Nos aseguramos de que los productos iniciales se hayan cargado.
    // Playwright esperará automáticamente a que este elemento sea visible.
    await expect(
      page
      .locator('.card')
      .first()
    )
    .toBeVisible({ timeout: 10000 });
  });

  test('Debería filtrar los productos correctamente al usar el buscador de texto', async ({ page }) => {
    // Datos de prueba
    const productoPremium = productos.premium.nombre; // Don Julio Premium Granos 500g
    const productoHacienda = productos.hacienda.nombre; // Hacienda Del Valle Molido 250g
    const terminoBusqueda = 'Premium';

    // 1. Acción: Se llama al método definido en la clase Navbar, busca y llena el textarea.
    await navbar.fillSearchArea(terminoBusqueda);
    await navbar.clickSearchButton();

    // 2. Aserción: Ahora que sabemos que el filtro se aplicó, verificamos el contenido.
    await expect(
      storePage.getProductCards()
      .filter({ hasText: productoPremium })
    )
    .toHaveCount(1);

    await expect(
      storePage.getProductCards()
      .filter({ hasText: productoHacienda })
    )
    .toHaveCount(0);

  });

  test('Debería ordenar los productos por precio de menor a mayor', async ({ page }) => {
    // 1. Acción: Seleccionamos la opción 'asc' en el dropdown.
    await storePage.sortByPrice('asc');

    // Esperamos un momento a que la UI se reordene.
    await page
      .waitForTimeout(500);

    // 2. Aserción
    // Obtenemos todos los textos de los precios de las tarjetas visibles.
    const priceTexts = await page
      .locator('.card:visible .ms-2.text-muted')
      .allTextContents();

    // Convertimos los textos a números.
    const prices = priceTexts
      .map(text => parseFloat(text.replace(/[$,]/g, '')));

    // Creamos una copia ordenada del array para comparar.
    const sortedPrices = [...prices].sort((a, b) => a - b);

    // Verificamos que los arrays son idénticos.
    expect(prices)
      .toEqual(sortedPrices);
  });

  test('Debería ordenar los productos por precio de mayor a menor', async ({ page }) => {
    // 1. Acción: Seleccionar la opción 'desc'.
    await storePage.sortByPrice('desc'); //La pagina se ordena descendentemente

    // Esperamos un momento a que la UI se reordene.
    await page
      .waitForTimeout(500);

    // 2. Aserción: Repetimos la misma lógica pero para orden descendente.
    const priceTexts = await page
      .locator('.card:visible .ms-2.text-muted')
      .allTextContents();
    
    const prices = priceTexts
      .map(text => parseFloat(text.replace(/[$,]/g, '')));
    
    const sortedPrices = [...prices]
      .sort((a, b) => b - a);

    //Comparacion si el orden descendente de la pagina coincide con el orden descendente esperado
    expect(prices)
      .toEqual(sortedPrices);


  });

  test('Deberia filtrar por rango de precios usando el slider', async ({ page }) => {
    const productoPremium = 'Don Julio Premium Granos 500g';
    const productoHacienda = 'Hacienda Del Valle Molido 250g';
    const amountToMove = 20; 

    // 1. Acción: Mover el manejador izquierdo del slider hacia la derecha para subir el precio minimo a 2000 o más.
    // Opción 1: Simulación de teclado (como en el ejemplo de Cypress)
    await storePage.movePriceSliderTo(amountToMove);

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

    // 2. Verificaciones: Comprobar que el producto más barato no exista y el más caro sea visible.
    await expect(
      storePage.getProductCards()
      .filter({ hasText: productoPremium })
    )
    .toHaveCount(1);

    await expect(
      storePage.getProductCards()
      .filter({ hasText: productoHacienda })
    )
    .toBeHidden();

  })
});