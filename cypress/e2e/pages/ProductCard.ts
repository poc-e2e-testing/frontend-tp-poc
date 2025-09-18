export class ProductCard {
  productName: string;

  constructor(productName: string) {
    this.productName = productName;
  }

  root() {
    return cy.contains('div.card', this.productName);
  }

  expectVisible() {
    this.root().should('be.visible');
  }

  expectPrice(price: string | RegExp) {
    this.root().should('contain', price);
  }

  clickEdit() {
    this.root().within(() => {
      cy.contains('button', 'Editar').click();
    });
  }

  clickDelete() {
    this.root().within(() => {
      cy.contains('button', 'Eliminar').click();
    });
  }

  confirmDelete() {
    cy.get('[data-testid="delete-modal"]').within(() => {
      cy.get('[data-testid="confirm-delete-button"]').click();
    });
    cy.contains('Producto eliminado correctamente').should('be.visible');
  }
}