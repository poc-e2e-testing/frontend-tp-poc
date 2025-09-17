class Navbar {

  get logoutButton() {
    return cy.get('[data-testid="logout-button"]');
  }

  get loginLink() {
    return cy.get('[data-testid="login-link"]');
  }

  get welcomeMessage() {
    return cy.get('[data-testid="welcome-message"]');
  }

  get adminPanelLink() {
    return cy.get('[data-testid="admin-panel-link"]');
  }

  get inicioLink() {
    return cy.get('[data-testid="inicio-button"]');
  }

  get tiendaLink() {
    return cy.get('[data-testid="tienda-button"]');
  }

  get nosotrosLink() {
    return cy.get('[data-testid="nosotros-button"]');
  }

  get misOrdenesLink() {
    return cy.get('[data-testid="mis-ordenes-button"]');
  }

  /**
   * Realiza la acción de hacer clic en el botón de cerrar sesión.
   */
  clickLogout() {
    this.logoutButton.click();
  }
}

export const navbar = new Navbar();
