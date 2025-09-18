import { type Page, type Locator, expect } from '@playwright/test';

export class StorePage {
  private readonly page: Page;

  // --- Elementos de Filtro ---
  public readonly searchInput: Locator;
  public readonly searchButton: Locator;
  public readonly sortSelect: Locator;
  public readonly priceSliderHandleMin: Locator;
  public readonly priceSliderContainer:Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-textarea');
    this.searchButton = page.getByTestId('search-button');
    this.sortSelect = page.getByTestId('sort-select');
    this.priceSliderHandleMin = page.locator('.rc-slider-handle').first();
    this.priceSliderContainer = page.locator('.rc-slider').first(); // O un test-id si lo tienes
  }

  // --- Elementos de la Grilla de Productos ---
  getProductCards() {
    return this.page.getByTestId('product-card');
  }

  // --- Acciones de Usuario ---
  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async sortByPrice(direction: 'asc' | 'desc' | '') {
    await this.sortSelect.selectOption(direction);
  }

  // --- Helpers para Aserciones ---
  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.getProductCards().getByTestId('product-price');
    const priceTexts = await priceLocators.allTextContents();
    return priceTexts.map(text => parseFloat(text.replace(/[$.]/g, '').replace(',', '.')));
  }

  async movePriceSliderTo(minValue: number) {
    await this.priceSliderHandleMin.click();
    for (let i = 0; i < minValue; i++) {
      await this.page.keyboard.press('ArrowRight');
    }
  }


    /**
   * Mueve el manejador de precio mínimo a una posición horizontal específica usando el mouse.
   * Esta es la forma preferida para simular la interacción del usuario con un slider.
   *
   * @param {number} xPosition La coordenada X en píxeles (relativa al contenedor del slider) a la que se arrastrará el manejador.
   */
  async movePriceSliderByMouse(xPosition: number): Promise<void> {
    // Buena práctica: Ejecutar la acción que causa una navegación o llamada de red
    // y la espera de esa respuesta en paralelo. Esto previene condiciones de carrera
    // y hace la prueba mucho más robusta y rápida.
    await Promise.all([
      // 1. Espera a que la API de productos responda, indicando que el filtro se aplicó.
      //    Usa un patrón de URL flexible para que no se rompa con cambios menores.
      this.page.waitForResponse(response =>
        response.url().includes('/api/products') && response.status() === 200
      ),

      // 2. Realiza la acción de arrastrar y soltar.
      //    'dragTo' es la API de alto nivel de Playwright que simula de forma fiable
      //    toda la secuencia: mousedown, mousemove y mouseup.
      this.priceSliderHandleMin.dragTo(this.priceSliderContainer, {
        targetPosition: { x: xPosition, y: 0 } // 'y: 0' lo mantiene en la línea horizontal.
      })
    ]);
  }
}