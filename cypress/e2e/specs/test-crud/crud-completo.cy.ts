/// <reference types="cypress" />

describe('CRUD de producto en Don Julio Cafe', () => {
  const filePath = 'playwright/fixtures/cafe.jpg';
  let nombreProducto: string;
  let admin: { email: string; password: string };

  before(() => {
    // Generar nombre único una sola vez
    nombreProducto = `Café Dorado ${Math.floor(Math.random() * 100000)}`;
    
    // Cargar credenciales de admin
    cy.fixture('userAdmin.json').then((user) => {
      admin = user.admin;
    });
  });

  beforeEach(() => {
    // Login antes de cada test para mantener la sesión
    cy.visit('http://localhost:5173/');
    cy.contains('Bienvenido a Don Julio Cafe').should('be.visible');

    cy.contains('a', 'Iniciar sesión').click();
    cy.contains('h1,h2,h3', 'Iniciar Sesión').should('be.visible');

    cy.get('#email').clear().type(admin.email);
    cy.get('#password').clear().type(admin.password);
    cy.contains('button', 'Entrar').click();

    // Ir al panel de administración
    cy.contains('a', 'Panel Admin').should('be.visible').click();
    cy.contains('h1,h2,h3', 'Store').should('be.visible');
  });

  it('1. Crear producto', () => {
    cy.log(`**Creando producto: ${nombreProducto}**`);
    
    // Creación de producto
    cy.get('input[name="nombre"]').type(nombreProducto);
    cy.get('input[name="descripcion"]').type('Café tostado premium');
    cy.get('input[placeholder="Precio"]').type('500');
    cy.get('input[placeholder="Stock"]').type('10');

    // Esperar a que los selects estén cargados y seleccionar opciones
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

    // Subir imagen
    cy.get('input[type="file"]').selectFile(filePath, { force: true });
    cy.get('img[alt="Vista previa"]').should('be.visible');

    // Crear producto
    cy.contains('button', 'Agregar Producto').click();
    cy.contains('Producto agregado correctamente').should('be.visible');

    // Verificar que el producto fue creado
    cy.visit('http://localhost:5173/adm-store');
    cy.contains('div.card', nombreProducto).should('be.visible');
    cy.contains('div.card', nombreProducto).should('contain', '500');
  });

  it('2. Editar producto', () => {
    cy.log(`**Editando producto: ${nombreProducto}**`);
    
    // Ir a la tienda para editar
    cy.visit('http://localhost:5173/adm-store');
    
    // Verificar que el producto existe antes de editarlo
    cy.contains('div.card', nombreProducto).should('be.visible');
    
    // Hacer click en editar
    cy.contains('div.card', nombreProducto).within(() => {
      cy.contains('button', 'Editar').click();
    });

    // Esperar confirmación de que el producto se cargó
    cy.contains('Producto cargado para editar').should('be.visible');

    // Esperar a que los selects estén cargados y seleccionar opciones
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

    // Cambiar el precio y subir imagen
    cy.get('input[placeholder="Precio"]').clear().type('600');
    cy.get('input[type="file"]').selectFile(filePath, { force: true });
    cy.get('img[alt="Vista previa"]').should('be.visible');

    // Actualizar producto
    cy.contains('button', 'Actualizar Producto').click();
    cy.contains('Producto actualizado correctamente').should('be.visible');

    // Verificar que el producto fue editado
    cy.visit('http://localhost:5173/adm-store');
    cy.contains('div.card', nombreProducto).should('be.visible');
    cy.contains('div.card', nombreProducto).should('contain', '600');
  });

  it('3. Eliminar producto', () => {
    cy.log(`**Eliminando producto: ${nombreProducto}**`);
    
    // Ir a la tienda para eliminar
    cy.visit('http://localhost:5173/adm-store');
    
    // Verificar que el producto editado existe
    cy.contains('div.card', nombreProducto).should('be.visible');
    cy.contains('div.card', nombreProducto).should('contain', '600');
    
    // Hacer click en eliminar
    cy.contains('div.card', nombreProducto).within(() => {
      cy.contains('button', 'Eliminar').click();
    });

    // Confirmar eliminación dentro del modal
    cy.get('div[role="dialog"]').within(() => {
      cy.contains('button', 'Eliminar').click({ force: true });
    });
    
    // Verificar mensaje de éxito
    cy.contains('Producto eliminado correctamente').should('be.visible');

    // Verificar que el producto fue eliminado
    cy.visit('http://localhost:5173/adm-store');
    cy.contains('div.card', nombreProducto).should('not.exist');

    // Cerrar sesión al final
    cy.contains('button', 'Cerrar sesión').click({ force: true });
    cy.visit('http://localhost:5173/');
    cy.contains('Bienvenido a Don Julio Cafe').should('be.visible');
  });
});