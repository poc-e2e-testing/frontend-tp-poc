import { type Page, type Locator } from '@playwright/test';

export class Navbar {
  // La propiedad 'page' es esencial para que el POM pueda interactuar con el navegador.
  private readonly page: Page;

  // --- Selectores (Locators) ---

  public readonly searchTextarea: Locator;
  public readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  get logoutButton(): Locator {
    return this.page.locator('[data-testid="logout-button"]');
  }

  get loginLink(): Locator {
    return this.page.locator('[data-testid="login-link"]');
  }

  get welcomeMessage(): Locator {
    return this.page.locator('[data-testid="welcome-message"]');
  }

  get adminPanelLink(): Locator {
    return this.page.locator('[data-testid="admin-panel-link"]');
  }

    // Inicializamos los localizadores usando getByTestId para máxima robustez.
    this.logoutButton = page.getByTestId('logout-button');
    this.loginLink = page.getByTestId('login-link');
    this.welcomeMessage = page.getByTestId('welcome-message');

    this.searchTextarea = page.getByTestId('search-textarea');
    this.searchButton = page.getByTestId('search-button');

  get inicioLink(): Locator {
    return this.page.locator('[data-testid="inicio-button"]');
  }

  get tiendaLink(): Locator {
    return this.page.locator('[data-testid="tienda-button"]');
  }

  get nosotrosLink(): Locator {
    return this.page.locator('[data-testid="nosotros-button"]');
  }

  get misOrdenesLink(): Locator {
    return this.page.locator('[data-testid="mis-ordenes-button"]');
  }

  // --- Acciones ---

  /**
   * Realiza la acción de hacer clic en el botón de cerrar sesión.
   */
  async clickLogout() {
    await this.logoutButton.click();
  }

  async fillSearchArea(textToFill: string) {
    //await this.searchTextarea.click();
    await this.searchTextarea.fill(textToFill);
  }

  async clickSearchButton() {
    await this.searchButton.click();
  }
}

// Helper para instanciar fácil en los tests
export function getNavbar(page: Page) {
  return new Navbar(page);
}

