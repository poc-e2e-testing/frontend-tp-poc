export class StorePage {
  // --- Elementos de Filtro ---
  get searchInput() {
    return cy.get('[data-testid="search-input"]');
  }

  get searchButton() {
    return cy.get('[data-testid="search-button"]');
  }

  get sortSelect() {
    return cy.get('[data-testid="sort-select"]');
  }

  get priceSliderHandleMin() {
    return cy.get('[data-testid="price-slider"]').find('.rc-slider-handle').eq(0);
  }

  // --- Elementos de la Grilla de Productos ---
  getProductCards() {
    return cy.get('[data-testid="product-card"]');
  }

  // --- Acciones de Usuario ---
  searchFor(term: string) {
    this.searchInput.clear().type(term);
    this.searchButton.click();
  }

  sortByPrice(direction: 'asc' | 'desc' | '') {
    // El valor del <option> es lo que se pasa aquí
    this.sortSelect.select(direction);
  }

  // --- Helper para Aserciones ---
  /**
   * Obtiene los precios de todas las tarjetas de producto visibles,
   * los limpia y los devuelve como un array de números.
   */
  getProductPrices(): Cypress.Chainable<number[]> {
    const prices: number[] = [];
    return this
      .getProductCards()
      .find('[data-testid="product-price"]')
      .each(($el) => {
        // Limpiamos el texto del precio (ej: "$1,800.00" -> 1800)
        const priceText = $el.text().replace(/[$,]/g, '');
        prices.push(parseFloat(priceText));
      })
      .then(() => prices); // Devolvemos el array de precios
  }
}