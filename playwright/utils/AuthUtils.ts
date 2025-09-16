import { type Page, expect } from '@playwright/test';

export class AuthUtils {
  constructor(private page: Page) {}

  /**
   * Realiza el login vía API y establece el estado de la sesión en el navegador.
   */
  async loginByApi(email: string, password: string) {
    await this.page.goto('/');

    const apiUrl = process.env.API_URL || 'http://localhost:10000';

    const loginResponse = await this.page.request.post(
      `${apiUrl}/api/auth/login`,
      {
        data: { email, password },
      }
    );
    expect(
      loginResponse.ok(),
      'La petición de login a la API debe ser exitosa.'
    ).toBeTruthy();
    const loginData = await loginResponse.json();
    const token = loginData.token;

    const meResponse = await this.page.request.get(`${apiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(
      meResponse.ok(),
      'La petición para obtener datos del usuario debe ser exitosa.'
    ).toBeTruthy();
    const meData = await meResponse.json();

    // Inyecta los datos de sesión en el localStorage del navegador.
    await this.page.evaluate(
      (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('clientEmail', data.user.email);
      },
      { token, user: meData.user }
    );
  }

  /**
   * Limpia programáticamente todo el estado de la sesión del navegador.
   */
  async logout() {
    await this.page.evaluate(() => {
      localStorage.clear();
      window.dispatchEvent(new Event('storage'));
    });
  }

  /**
   * Verifica que no hay datos de sesión en el localStorage.
   */
  async verifyLoggedOut() {
    const token = await this.page.evaluate(() => localStorage.getItem('token'));
    const user = await this.page.evaluate(() => localStorage.getItem('user'));
    const clientEmail = await this.page.evaluate(() =>
      localStorage.getItem('clientEmail')
    );

    expect(token, 'El token debe ser nulo tras el logout').toBeNull();
    expect(user, 'El usuario debe ser nulo tras el logout').toBeNull();
    expect(
      clientEmail,
      'El email del cliente debe ser nulo tras el logout'
    ).toBeNull();
  }
}
