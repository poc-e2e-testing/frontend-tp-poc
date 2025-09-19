/**
 * Page Object Model para la página de tienda.
 * Permite interactuar y validar los elementos y acciones principales de la Store.
 */
class StorePage {
  /** Devuelve el input de búsqueda de productos. */
  get searchInput() {
    return cy.get('[data-testid="search-textarea"]');
  }

  /** Devuelve el botón de búsqueda. */
  get searchButton() {
    return cy.get('[data-testid="search-button"]');
  }

  /** Devuelve el selector de ordenamiento. */
  get sortSelect() {
    return cy.get('[data-testid="sort-select"]');
  }

  /** Devuelve el handle mínimo del slider de precios. */
  get priceSliderHandleMin() {
    return cy.get('[data-testid="price-slider"]').find('[role="slider"]').eq(0);
  }

  /** Devuelve los elementos de las tarjetas de producto. */
  getProductCards() {
    return cy.get('[data-testid="product-card"]');
  }

  /**
   * Realiza una búsqueda de productos por término.
   * @param {string} term - Término de búsqueda.
   */
  searchFor(term: string) {
    this.searchInput.clear().type(term);
    this.searchButton.click();
  }

  /**
   * Ordena los productos por precio.
   * @param {'asc' | 'desc' | ''} direction - Dirección de ordenamiento.
   */
  sortByPrice(direction: 'asc' | 'desc' | '') {
    this.sortSelect.select(direction);
  }

  /**
   * Ajusta el slider de precio mínimo al valor objetivo.
   * @param {number} targetValue - Valor mínimo deseado.
   */
  public setPriceSliderMin(targetValue: number): void {
    const min = 0;
    const step = 100;
    const stepsToMove = (targetValue - min) / step;
    if (stepsToMove < 0) return;
    const keyPresses = '{rightarrow}'.repeat(stepsToMove);
    this.priceSliderHandleMin.should('be.visible').focus().type(keyPresses);
  }

  /**
   * Obtiene los precios de todas las tarjetas de producto visibles,
   * los limpia y los devuelve como un array de números.
   * @returns {Cypress.Chainable<number[]>} Array de precios.
   */
  getProductPrices(): Cypress.Chainable<number[]> {
    const prices: number[] = [];
    return this.getProductCards()
      .find('[data-testid="product-price"]')
      .each(($el) => {
        const priceText = $el.text().replace(/[$,]/g, '');
        prices.push(parseFloat(priceText));
      })
      .then(() => prices);
  }
}

export const storePage = new StorePage();
