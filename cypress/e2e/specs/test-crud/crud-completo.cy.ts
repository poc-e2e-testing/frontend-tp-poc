/// <reference types="cypress" />

describe('CRUD de producto en Don Julio Cafe', () => {
  const filePath = 'playwright/fixtures/cafe.jpg';
  const nombreProducto = `Café Dorado ${Math.floor(Math.random() * 100000)}`;
  let admin: { email: string; password: string };

  before(() => {
    cy.fixture('userAdmin.json').then((user) => {
      admin = user.admin;
    });
  });

  it('Flujo completo CRUD producto', () => {
    // Página principal
    cy.visit('http://localhost:5173/');
    cy.contains('Bienvenido a Don Julio Cafe').should('be.visible');

    // Login
    cy.contains('a', 'Iniciar sesión').click();
    cy.contains('h1,h2,h3', 'Iniciar Sesión').should('be.visible');

    cy.get('#email').clear().type(admin.email);
    cy.get('#password').clear().type(admin.password);
    cy.contains('button', 'Entrar').click();

    cy.contains('a', 'Panel Admin').should('be.visible').click();
    cy.contains('h1,h2,h3', 'Store').should('be.visible');

    // Creación de producto
    cy.get('input[name="nombre"]').type(nombreProducto);
    cy.get('input[name="descripcion"]').type('Café tostado premium');
    cy.get('input[placeholder="Precio"]').type('500');
    cy.get('input[placeholder="Stock"]').type('10');

    // Esperar a que los selects estén llenos
   cy.get('select[name="productBrand"]')
  .find('option')
  .should('have.length.greaterThan', 1)  // ahora cuenta los <option>
  .then(() => {
    cy.get('select[name="productBrand"]').select('Don Julio Premium');
  });

cy.get('select[name="productClass"]')
  .find('option')
  .should('have.length.greaterThan', 1)
  .then(() => {
    cy.get('select[name="productClass"]').select('Granos');
  });

    cy.get('input[type="file"]').selectFile(filePath, { force: true });
    cy.get('img[alt="Vista previa"]').should('be.visible');

    cy.contains('button', 'Agregar Producto').click();
    cy.contains('Producto agregado correctamente').should('be.visible');

    // Edición del producto
    cy.visit('http://localhost:5173/adm-store');

    cy.contains('div.card', nombreProducto).within(() => {
  cy.contains('button', 'Editar').click();
});

// Esperar que los selects estén cargados
cy.get('select[name="productBrand"]')
  .find('option')
  .should('have.length.greaterThan', 1)
  .then(() => {
    cy.get('select[name="productBrand"]').select('Don Julio Premium');
  });

cy.get('select[name="productClass"]')
  .find('option')
  .should('have.length.greaterThan', 1)
  .then(() => {
    cy.get('select[name="productClass"]').select('Granos');
  });

// Luego actualiza precio, imagen, etc.
cy.get('input[placeholder="Precio"]').clear().type('600');
cy.get('input[type="file"]').selectFile(filePath, { force: true });
cy.get('img[alt="Vista previa"]').should('be.visible');

cy.contains('button', 'Actualizar Producto').click();
cy.contains('Producto actualizado correctamente').should('be.visible');

// Eliminación del producto
cy.visit('http://localhost:5173/adm-store');

cy.contains('div.card', nombreProducto).within(() => {
  cy.contains('button', 'Eliminar').click();
});

// Confirmar eliminación dentro del modal
cy.get('div[role="dialog"]').within(() => {
  cy.contains('button', 'Eliminar').click({ force: true });
});
cy.contains('Producto eliminado correctamente').should('be.visible');

    // Cerrar sesión
    cy.visit('http://localhost:5173/adm-store');
    cy.contains('button', 'Cerrar sesión').click({ force: true });
    cy.visit('http://localhost:5173/');
  });
});