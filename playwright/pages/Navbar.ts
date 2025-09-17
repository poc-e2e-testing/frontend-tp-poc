import { type Page, type Locator } from '@playwright/test';

export class Navbar {
  // La propiedad 'page' es esencial para que el POM pueda interactuar con el navegador.
  private readonly page: Page;

  // --- Selectores (Locators) ---

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
}

// Helper para instanciar fácil en los tests
export function getNavbar(page: Page) {
  return new Navbar(page);
}

