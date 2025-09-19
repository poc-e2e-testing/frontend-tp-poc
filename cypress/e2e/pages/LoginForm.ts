/**
 * Page Object Model para el formulario de login.
 * Permite interactuar con los elementos principales del login.
 */
class LoginForm {
  /**
   * Devuelve el input de email.
   */
  get emailInput() {
    return cy.get('[data-testid="email-input"]');
  }

  /**
   * Devuelve el input de contraseña.
   */
  get passwordInput() {
    return cy.get('[data-testid="password-input"]');
  }

  /**
   * Devuelve el botón de envío del formulario.
   */
  get submitButton() {
    return cy.get('[data-testid="login-button"]');
  }

  /**
   * Realiza el login usando email y contraseña.
   * @param {string} email - Email del usuario.
   * @param {string} password - Contraseña del usuario.
   */
  login(email: string, password: string) {
    this.emailInput.type(email);
    this.passwordInput.type(password);
    this.submitButton.click();
  }
}

export const loginForm = new LoginForm();
