import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model para la página de la tienda.
 * Encapsula los elementos y acciones del usuario para filtrar y ver productos.
 */
export class StorePage {
  private readonly page: Page;

  // --- Elementos de Filtro ---
  public readonly searchInput: Locator;
  public readonly searchButton: Locator;
  public readonly sortSelect: Locator;
  public readonly priceSliderHandleMin: Locator;
  public readonly priceSliderContainer: Locator;

  /**
   * Inicializa la página de la tienda.
   * @param {Page} page - Instancia de la página de Playwright.
   */
  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-textarea');
    this.searchButton = page.getByTestId('search-button');
    this.sortSelect = page.getByTestId('sort-select');
    this.priceSliderHandleMin = page.locator('.rc-slider-handle').first();
    this.priceSliderContainer = page.locator('.rc-slider').first(); // O un test-id si lo tienes
  }

  /**
   * Obtiene todas las tarjetas de productos visibles.
   * @returns {Locator} Un localizador que apunta a las tarjetas de productos.
   */
  getProductCards() {
    return this.page.getByTestId('product-card');
  }

  /**
   * Rellena el campo de búsqueda y hace clic en el botón de buscar.
   * @param {string} term - Texto a buscar.
   */
  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  /**
   * Selecciona una opción del desplegable para ordenar los productos.
   * @param {'asc' | 'desc' | ''} direction - Dirección de ordenamiento ('asc', 'desc', o '').
   */
  async sortByPrice(direction: 'asc' | 'desc' | '') {
    await this.sortSelect.selectOption(direction);
  }

  /**
   * Extrae y devuelve los precios de todos los productos en la página.
   * @returns {Promise<number[]>} - Un array con los precios en formato numérico.
   */
  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.getProductCards().getByTestId('product-price');
    const priceTexts = await priceLocators.allTextContents();
    return priceTexts.map((text) =>
      parseFloat(text.replace(/[$.]/g, '').replace(',', '.'))
    );
  }

  /**
   * Mueve el control deslizante de precio mínimo usando el teclado.
   * @param {number} minValue - El número de veces que se presionará la flecha derecha.
   */
  async movePriceSliderTo(minValue: number) {
    await this.priceSliderHandleMin.click();
    for (let i = 0; i < minValue; i++) {
      await this.page.keyboard.press('ArrowRight');
    }
  }

  /**
   * Mueve el manejador de precio mínimo arrastrándolo con el ratón.
   * @param {number} xPosition - Coordenada X (píxeles) a la que se moverá el manejador.
   */
  async movePriceSliderByMouse(xPosition: number): Promise<void> {
    await this.priceSliderHandleMin.dragTo(this.priceSliderContainer, {
      targetPosition: { x: xPosition, y: 0 },
    });
  }
}