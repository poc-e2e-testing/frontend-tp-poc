/**
 * Page Object Model para la tarjeta de producto.
 * Permite interactuar y validar los elementos de una tarjeta de producto en la UI.
 */
export class ProductCard {
  /** Nombre del producto representado por la tarjeta. */
  productName: string;

  /**
   * Inicializa una instancia de ProductCard.
   * @param {string} productName - Nombre del producto.
   */
  constructor(productName: string) {
    this.productName = productName;
  }

  /**
   * Devuelve el elemento raíz de la tarjeta de producto.
   */
  root() {
    return cy.contains('div.card', this.productName);
  }

  /**
   * Valida que la tarjeta de producto sea visible.
   */
  expectVisible() {
    this.root().should('be.visible');
  }

  /**
   * Valida que el precio esté presente en la tarjeta.
   * @param {string|RegExp} price - Precio esperado.
   */
  expectPrice(price: string | RegExp) {
    this.root().should('contain', price);
  }

  /**
   * Hace clic en el botón de editar de la tarjeta.
   */
  clickEdit() {
    this.root().within(() => {
      cy.contains('button', 'Editar').click();
    });
  }

  /**
   * Hace clic en el botón de eliminar de la tarjeta.
   */
  clickDelete() {
    this.root().within(() => {
      cy.contains('button', 'Eliminar').click();
    });
  }

  /**
   * Confirma la eliminación del producto y valida el mensaje de éxito.
   */
  confirmDelete() {
    cy.get('[data-testid="delete-modal"]').within(() => {
      cy.get('[data-testid="confirm-delete-button"]').click();
    });
    cy.contains('Producto eliminado correctamente').should('be.visible');
  }
}
