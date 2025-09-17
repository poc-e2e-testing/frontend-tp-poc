class StorePage {
  // --- Elementos de Filtro ---
  get searchInput() {
    return cy.get('[data-testid="search-textarea"]');
  }

  get searchButton() {
    return cy.get('[data-testid="search-button"]');
  }

  get sortSelect() {
    return cy.get('[data-testid="sort-select"]');
  }

  get priceSliderHandleMin() {
    return cy.get('[data-testid="price-slider"]').find('[role="slider"]').eq(0);
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

  public setPriceSliderMin(targetValue: number): void {
  // Estos valores deben coincidir con los de tu componente React
  const min = 0;
  const step = 100;

  // 1. Calculamos cuántas veces necesitamos presionar la flecha derecha.
  // Si targetValue es 2000, y el step es 100, necesitamos presionarla 20 veces.
  const stepsToMove = (targetValue - min) / step;
  if (stepsToMove < 0) return; // No hacemos nada si el valor es inválido

  const keyPresses = '{rightarrow}'.repeat(stepsToMove);

  // 2. Usamos el selector robusto y la interacción de teclado,
  //    que es mucho más fiable que un drag-and-drop simulado.
  this.priceSliderHandleMin
    .should('be.visible')
    .focus()
    .type(keyPresses);
}
  
  // --- Helper para Aserciones ---
  /**
   * Obtiene los precios de todas las tarjetas de producto visibles,
   * los limpia y los devuelve como un array de números.
   */
  getProductPrices(): Cypress.Chainable<number[]> {
    const prices: number[] = [];
    return this.getProductCards()
      .find('[data-testid="product-price"]')
      .each(($el) => {
        // Limpiamos el texto del precio (ej: "$1,800.00" -> 1800)
        const priceText = $el.text().replace(/[$,]/g, '');
        prices.push(parseFloat(priceText));
      })
      .then(() => prices); // Devolvemos el array de precios
  }
}

export const storePage = new StorePage();