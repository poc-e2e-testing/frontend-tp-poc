/// <reference types="cypress" />

import { ProductForm } from '../../pages/ProductForm';
import { ProductCard } from '../../pages/ProductCard';

describe('CRUD de producto en Don Julio Cafe', () => {
  const filePath = 'cypress/fixtures/cafe.jpg';
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
    const form = new ProductForm();

    cy.log(`**Creando producto: ${nombreProducto}**`);

    form.fillForm({
      nombre: nombreProducto,
      descripcion: 'Café tostado premium',
      precio: '500',
      stock: '10',
      brand: 'Don Julio Premium',
      productClass: 'Granos',
      filePath,
    });

    form.expectPreviewVisible();
    form.submitAndExpectAddSuccess();

    // Verificar producto creado
    const card = new ProductCard(nombreProducto);
    cy.visit('http://localhost:5173/adm-store');
    card.expectVisible();
    card.expectPrice('500');
  });

  it('2. Editar producto', () => {
    const form = new ProductForm();
    const card = new ProductCard(nombreProducto);

    cy.log(`**Editando producto: ${nombreProducto}**`);

    cy.visit('http://localhost:5173/adm-store');
    card.expectVisible();
    card.clickEdit();

    cy.contains('Producto cargado para editar').should('be.visible');

    form.fillForm({
      precio: '600',
       brand: 'Don Julio Premium',
      productClass: 'Granos',
      filePath,
    });

    form.expectPreviewVisible();
    form.submitUpdateAndExpectSuccess();

    // Verificar que se actualizó
    cy.visit('http://localhost:5173/adm-store');
    card.expectVisible();
    card.expectPrice('600');
  });

  it('3. Eliminar producto', () => {
    const card = new ProductCard(nombreProducto);

    cy.log(`**Eliminando producto: ${nombreProducto}**`);

    cy.visit('http://localhost:5173/adm-store');
    card.expectVisible();
    card.expectPrice('600');

    card.clickDelete();

    // Confirmar dentro del modal
    cy.get('div[role="dialog"]').within(() => {
      cy.contains('button', 'Eliminar').click({ force: true });
    });

    cy.contains('Producto eliminado correctamente').should('be.visible');

    // Verificar que se eliminó
    cy.visit('http://localhost:5173/adm-store');
    cy.contains('div.card', nombreProducto).should('not.exist');

  });
});
