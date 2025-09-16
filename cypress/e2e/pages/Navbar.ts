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

  /**
   * Realiza la acción de hacer clic en el botón de cerrar sesión.
   */
  clickLogout() {
    this.logoutButton.click();
  }
}

export const navbar = new Navbar();
