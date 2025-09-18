import { type Page, type Locator } from '@playwright/test';
import { expect } from '@playwright/test';
export class Navbar {
  private readonly page: Page;

  // --- Elementos de Logout ---
  public readonly logoutButton: Locator;
  public readonly loginLink: Locator;
  public readonly tiendaLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByTestId('logout-button');
    this.loginLink = page.getByTestId('login-link');
    this.tiendaLink = page.getByTestId('tienda-button');
  }

  // --- Getters dinámicos ---

  get welcomeMessage(): Locator {
    return this.page.getByTestId('welcome-message');
  }

  get adminPanelLink(): Locator {
    return this.page.getByTestId('admin-panel-link');
  }

  get inicioLink(): Locator {
    return this.page.getByTestId('inicio-button');
  }

  get nosotrosLink(): Locator {
    return this.page.getByTestId('nosotros-button');
  }

  get misOrdenesLink(): Locator {
    return this.page.getByTestId('mis-ordenes-button');
  }

  // --- Acciones ---
  async clickLogout() {
    await this.logoutButton.click();
  }

  async goToLogin() {
    await this.loginLink.click();
  }


  // Se usa?
  async goToInicio() {
    await this.inicioLink.click();
  }

  async goToTienda() {
    await this.tiendaLink.click();
  }

}

// Helper para instanciar fácil en los tests
export function getNavbar(page: Page) {
  return new Navbar(page);
}
