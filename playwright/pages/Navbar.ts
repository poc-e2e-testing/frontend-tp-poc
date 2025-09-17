import { type Page, type Locator } from '@playwright/test';

export class Navbar {
  // La propiedad 'page' es esencial para que el POM pueda interactuar con el navegador.
  private readonly page: Page;

  // --- Selectores (Locators) ---
  public readonly logoutButton: Locator;
  public readonly loginLink: Locator;
  public readonly welcomeMessage: Locator;

  public readonly searchTextarea: Locator;
  public readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Inicializamos los localizadores usando getByTestId para máxima robustez.
    this.logoutButton = page.getByTestId('logout-button');
    this.loginLink = page.getByTestId('login-link');
    this.welcomeMessage = page.getByTestId('welcome-message');

    this.searchTextarea = page.getByTestId('search-textarea');
    this.searchButton = page.getByTestId('search-button');
  }

  // --- Acciones ---

  /**
   * Realiza la acción de hacer clic en el botón de cerrar sesión.
   */
  async clickLogout() {
    await this.logoutButton.click();
  }

  async fillSearchArea(textToFill: string) {
    await this.searchTextarea.click();
    await this.searchTextarea.fill(textToFill);
  }

  async clickSearchButton() {
    await this.searchButton.click();
  }
}
