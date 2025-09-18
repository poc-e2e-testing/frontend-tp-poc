/**
 * Page Object Model para el formulario de login en Playwright.
 * Permite interactuar y automatizar el flujo de autenticación.
 */
import { type Page, type Locator } from '@playwright/test';

export class LoginForm {
  private readonly page: Page;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly submitButton: Locator;

  /**
   * Inicializa el formulario de login.
   * @param {Page} page - Instancia de la página de Playwright.
   */
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.getByRole('button', { name: 'Entrar' });
  }

  /**
   * Navega a la página de login.
   */
  async goto() {
    await this.page.goto('/login');
  }

  /**
   * Realiza el login completando el formulario y enviando los datos.
   * @param {string} email - Email del usuario.
   * @param {string} password - Contraseña del usuario.
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
