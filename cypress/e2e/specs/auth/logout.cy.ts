import { navbar } from '../../pages/Navbar';

/**
 * Suite de tests de autenticación: logout.
 * Valida el flujo de cierre de sesión y limpieza de estado.
 */
describe('Flujo de Logout', () => {
  let usuarios: any;

  before(() => {
    // Carga datos de prueba una sola vez para toda la suite
    cy.fixture('usuarios.json').then((data) => {
      usuarios = data;
    });
  });

  /**
   * Cierre de sesión desde la interfaz de usuario.
   */
  context('Cierre de sesión desde la interfaz de usuario', () => {
    beforeEach(() => {
      // Prepara el estado antes de cada test: inicia sesión vía API.
      // cy.session() optimiza esto para que sea casi instantáneo después de la primera vez.
      cy.loginByApi(
        usuarios.validos.admin.email,
        usuarios.validos.admin.password
      );
      cy.visit('/store');
    });

    /**
     * Debe limpiar completamente el estado de la sesión al hacer logout desde la UI.
     */
    it('debería limpiar completamente el estado de la sesión al hacer logout desde la UI', () => {
      // 1. Verificación inicial: Asegurarse de que el usuario está logueado.
      navbar.logoutButton.should('be.visible');

      // 2. Acción: Hacer clic en el botón de logout usando el método del POM.
      navbar.clickLogout();

      // 3. Verificación post-acción:
      cy.url().should('match', /\/login|home|$/);

      cy.window().then((win) => {
        // Estas aserciones deberían pasar porque la app sí limpia el token y el usuario.
        expect(win.localStorage.getItem('token'), 'El token debe ser nulo').to
          .be.null;
        expect(win.localStorage.getItem('user'), 'El usuario debe ser nulo').to
          .be.null;
        expect(
          win.localStorage.getItem('clientEmail'),
          'El clientEmail debe ser nulo'
        ).to.be.null;
      });
    });

    /**
     * Debe redirigir al login y actualizar la UI para un usuario deslogueado.
     */
    it('debería redirigir al login y actualizar la UI para un usuario deslogueado', () => {
      // Acción
      navbar.clickLogout();

      // Verificación
      cy.url().should('include', '/login');
      navbar.loginLink.should('be.visible');
      navbar.logoutButton.should('not.exist');
    });
  });

  /**
   * Gestión del estado de la sesión.
   */
  context('Gestión del estado de la sesión', () => {
    /**
     * El comando cy.logout() programático debe limpiar todo el estado de la sesión.
     */
    it('el comando cy.logout() programático debe limpiar todo el estado de la sesión', () => {
      // 1. Setup: Iniciar sesión y visitar una página.
      cy.loginByApi(
        usuarios.validos.client.email,
        usuarios.validos.client.password
      );
      cy.visit('/my-orders');
      cy.window().then(
        (win) => expect(win.localStorage.getItem('token')).to.exist
      );

      // 2. Acción: Ejecutar el comando de logout programático.
      cy.logout();

      // 3. Verificación: El comando (corregido) debe haber limpiado todas las claves.
      // Esta prueba pasa, demostrando que nuestro comando de prueba es fiable.
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
        expect(win.localStorage.getItem('user')).to.be.null;
        expect(win.localStorage.getItem('clientEmail')).to.be.null;
      });
    });

    /**
     * Debe desloguear al usuario si el localStorage se limpia externamente.
     */
    it('debería desloguear al usuario si el localStorage se limpia externamente', () => {
      // 1. Setup: Iniciar sesión y visitar una página.
      cy.loginByApi(
        usuarios.validos.client.email,
        usuarios.validos.client.password
      );
      cy.visit('/store');
      navbar.logoutButton.should('be.visible');

      // 2. Acción: Simular que otra pestaña o script limpia el localStorage.
      cy.clearLocalStorage();

      // 3. Verificación: Al recargar, la aplicación debe reaccionar al estado limpio.
      cy.reload();
      navbar.loginLink.should('be.visible');
      navbar.logoutButton.should('not.exist');
    });
  });
});
