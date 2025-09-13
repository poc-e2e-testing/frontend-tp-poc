import { Page, expect } from '@playwright/test';

export class AuthHelpers {
  constructor(private page: Page) {}

  /**
   * Login mediante UI (simula el flujo real del usuario)
   */
  async loginUi(email: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
    
    // Esperar redirección exitosa a /store
    await expect(this.page).toHaveURL(/.*\/store/);
    
    // Verificar que el localStorage contiene los tokens
    const token = await this.page.evaluate(() => localStorage.getItem('token'));
    const user = await this.page.evaluate(() => localStorage.getItem('user'));
    expect(token).toBeTruthy();
    expect(user).toBeTruthy();
  }

  /**
   * Login directo contra API (más rápido para setup de tests)
   */
  async loginByApi(email: string, password: string) {
    const apiUrl = process.env.API_URL || 'http://localhost:10000';
    
    // Hacer login contra la API
    const loginResponse = await this.page.request.post(`${apiUrl}/api/auth/login`, {
      data: {
        email: email,
        password: password,
      }
    });
    
    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    // Obtener datos del usuario
    const meResponse = await this.page.request.get(`${apiUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    expect(meResponse.status()).toBe(200);
    const meData = await meResponse.json();
    
    // Simular el localStorage como la aplicación
    await this.page.addInitScript((data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('clientEmail', data.user.email);
    }, { token, user: meData.user });
  }

  /**
   * Logout programático (limpia todo el localStorage)
   */
  async logout() {
    await this.page.evaluate(() => {
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('clientEmail');
      localStorage.removeItem('lastOrderId');
      
      // Disparar evento storage para que React detecte el cambio
      window.dispatchEvent(new Event('storage'));
    });
    
    // Verificar que se limpió
    const token = await this.page.evaluate(() => localStorage.getItem('token'));
    const user = await this.page.evaluate(() => localStorage.getItem('user'));
    const clientEmail = await this.page.evaluate(() => localStorage.getItem('clientEmail'));
    
    expect(token).toBeNull();
    expect(user).toBeNull();
    expect(clientEmail).toBeNull();
  }

  /**
   * Verificar que el usuario está logueado
   */
  async verifyLoggedIn() {
    const token = await this.page.evaluate(() => localStorage.getItem('token'));
    const user = await this.page.evaluate(() => localStorage.getItem('user'));
    expect(token).toBeTruthy();
    expect(user).toBeTruthy();
  }

  /**
   * Verificar que el usuario está deslogueado
   */
  async verifyLoggedOut() {
    const token = await this.page.evaluate(() => localStorage.getItem('token'));
    const user = await this.page.evaluate(() => localStorage.getItem('user'));
    const clientEmail = await this.page.evaluate(() => localStorage.getItem('clientEmail'));
    expect(token).toBeNull();
    expect(user).toBeNull();
    expect(clientEmail).toBeNull();
  }
}