import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model para la barra de navegación (Navbar).
 * Proporciona una interfaz para interactuar con los enlaces y elementos comunes de navegación.
 */
export class Navbar {
  private readonly page: Page;

  // --- Elementos de Logout ---
  public readonly logoutButton: Locator;
  public readonly loginLink: Locator;
  public readonly tiendaLink: Locator;

  /**
   * Inicializa la barra de navegación.
   * @param {Page} page - Instancia de la página de Playwright.
   */
  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByTestId('logout-button');
    this.loginLink = page.getByTestId('login-link');
    this.tiendaLink = page.getByTestId('tienda-button');
  }

  // --- Getters dinámicos ---

  /**
   * @returns {Locator} El localizador para el mensaje de bienvenida al usuario.
   */
  get welcomeMessage(): Locator {
    return this.page.getByTestId('welcome-message');
  }

  /**
   * @returns {Locator} El localizador para el enlace al panel de administración.
   */
  get adminPanelLink(): Locator {
    return this.page.getByTestId('admin-panel-link');
  }

  /**
   * @returns {Locator} El localizador para el enlace a la página de Inicio.
   */
  get inicioLink(): Locator {
    return this.page.getByTestId('inicio-button');
  }

  /**
   * @returns {Locator} El localizador para el enlace a la página de Nosotros.
   */
  get nosotrosLink(): Locator {
    return this.page.getByTestId('nosotros-button');
  }

  /**
   * @returns {Locator} El localizador para el enlace a la página de Mis Órdenes.
   */
  get misOrdenesLink(): Locator {
    return this.page.getByTestId('mis-ordenes-button');
  }

  // --- Acciones ---

  /**
   * Hace clic en el botón para cerrar la sesión del usuario.
   */
  async clickLogout() {
    await this.logoutButton.click();
  }

  /**
   * Navega a la página de inicio.
   */
  async goToInicio() {
    await this.inicioLink.click();
  }

  /**
   * Navega a la página de la tienda.
   */
  async goToTienda() {
    await this.tiendaLink.click();
  }
}

/**
 * Función de ayuda para instanciar la clase Navbar.
 * @param {Page} page - Instancia de la página de Playwright.
 * @returns {Navbar} Una nueva instancia de la clase Navbar.
 */
export function getNavbar(page: Page) {
  return new Navbar(page);
}