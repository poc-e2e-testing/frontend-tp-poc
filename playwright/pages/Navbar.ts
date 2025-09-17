import { type Page, type Locator } from '@playwright/test';
import { expect } from '@playwright/test';
export class Navbar {
  // La propiedad 'page' es esencial para que el POM pueda interactuar con el navegador.
  private readonly page: Page;

  // --- Selectores (Locators) ---
  public readonly logoutButton: Locator;
  public readonly loginLink: Locator;
  public readonly welcomeMessage: Locator;
  public readonly panelAdminLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Inicializamos los localizadores usando getByTestId para máxima robustez.
    this.logoutButton = page.getByTestId('logout-button');
    this.loginLink = page.getByTestId('login-link');
    this.welcomeMessage = page.getByTestId('welcome-message');
    this.panelAdminLink = page.getByTestId('panel-admin-link');
  }

  // --- Acciones ---

  /**
   * Realiza la acción de hacer clic en el botón de cerrar sesión.
   */
  async clickLogout() {
    await this.logoutButton.click();
  }

  /**
   * Navega al panel de administración y verifica que la navegación fue exitosa.
   */
 // Navbar.ts

  get adminPanel() {
    return this.page.getByRole('link', { name: /Panel Admin/i })
      .or(this.page.getByRole('button', { name: /Panel Admin/i }));
  }

  async goToAdminPanel() {
    await this.adminPanel.click();
  }

}
