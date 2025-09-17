import { loginForm } from '../../pages/LoginForm';

describe('Login - Cypress', () => {
  let usuarios: any;

  before(() => {
    // Cargar datos de prueba una sola vez para todos los tests de este describe
    cy.fixture('usuarios.json').then((data) => {
      usuarios = data;
    });
  });

  it('Login exitoso con usuario válido', () => {
    // 1. Ir a login
    cy.visit('/login');

    // 2. Completar formulario con datos de usuario válido
    loginForm.login(
      usuarios.validos.admin.email,
      usuarios.validos.admin.password
    );

    // 3. Verificar redirección a la tienda
    cy.url().should('include', '/store');

    // 4. Verificar que el token de autenticación se guarda en localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist;
    });
  });

  it('Login falla con email incorrecto', () => {
    // 1. Ir a login
    cy.visit('/login');

    // 2. Completar formulario con email incorrecto
    loginForm.login(
      usuarios.invalidos.emailIncorrecto.email,
      usuarios.invalidos.emailIncorrecto.password
    );

    // 3. Verificar que la URL no ha cambiado
    cy.url().should('include', '/login');

    // 4. Verificar que se muestra el mensaje de error apropiado
    cy.contains('Cliente no encontrado').should('be.visible');
  });
});
