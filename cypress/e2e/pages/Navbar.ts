/**
 * Page Object Model para la barra de navegación principal.
 * Permite interactuar con los elementos clave de la navbar.
 */
class Navbar {
  /**
   * Devuelve el botón de logout.
   */
  get logoutButton() {
    return cy.get('[data-testid="logout-button"]');
  }

  /**
   * Devuelve el enlace de login.
   */
  get loginLink() {
    return cy.get('[data-testid="login-link"]');
  }

  /**
   * Devuelve el mensaje de bienvenida.
   */
  get welcomeMessage() {
    return cy.get('[data-testid="welcome-message"]');
  }

  /**
   * Devuelve el enlace al panel de administración.
   */
  get adminPanelLink() {
    return cy.get('[data-testid="admin-panel-link"]');
  }

  /**
   * Devuelve el enlace de inicio.
   */
  get inicioLink() {
    return cy.get('[data-testid="inicio-button"]');
  }

  /**
   * Devuelve el enlace de tienda.
   */
  get tiendaLink() {
    return cy.get('[data-testid="tienda-button"]');
  }

  /**
   * Devuelve el enlace de nosotros.
   */
  get nosotrosLink() {
    return cy.get('[data-testid="nosotros-button"]');
  }

  /**
   * Devuelve el enlace de mis órdenes.
   */
  get misOrdenesLink() {
    return cy.get('[data-testid="mis-ordenes-button"]');
  }

  /**
   * Hace clic en el botón de cerrar sesión.
   */
  clickLogout() {
    this.logoutButton.click();
  }
}

export const navbar = new Navbar();
