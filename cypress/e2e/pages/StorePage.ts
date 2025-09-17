export class StorePage {
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

  setMinValue(value: number) {
    // Seleccionamos el input subyacente, le cambiamos el valor con invoke,
    // y luego disparamos el evento 'input' para que React actualice la UI.
    this.priceSliderHandleMin
      .click()
      .invoke('val', value)
      .trigger('input', { force: true });
  }

  setMinValueByDrag(targetValue: number) {
    const min = 0;
    const max = 60000; // Estos valores vienen de tu componente en Store.tsx

    // Calculamos la posición porcentual
    const percent = (targetValue - min) / (max - min);

    // Obtenemos el ancho del slider para calcular la posición en píxeles
    cy.get('[data-testid="price-slider"]').then(($slider) => {
      const sliderWidth = $slider.width();
      const targetX = sliderWidth * percent;

      // Simulamos la secuencia de eventos de arrastre
      this.priceSliderHandleMin
        .trigger('mousedown', { which: 1, force: true })
        .trigger('mousemove', { clientX: targetX, force: true })
        .trigger('mouseup', { force: true });
    });
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
