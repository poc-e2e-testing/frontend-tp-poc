/**
 * Test E2E unificado para el flujo completo de la app Don Julio Cafe.
 * Valida login, navegación, filtros, CRUD de producto y logout.
 */
import { navbar } from '../../pages/Navbar';
import { storePage } from '../../pages/StorePage';
import { loginForm } from '../../pages/LoginForm';

let usuarios, products;
const filePath = 'playwright/fixtures/cafe.jpg';
const nombreProducto = `Café Dorado ${Math.floor(Math.random() * 100000)}`;

before(() => {
  cy.fixture('usuarios.json').then((data) => {
    usuarios = data;
  });
  cy.fixture('product.json').then((data) => {
    products = data;
  });
});

describe('Flujo E2E Unificado - Don Julio Cafe', () => {
  /**
   * Valida el flujo completo: login, navegación, filtros, CRUD y logout.
   */
  it('Login, navegación, filtros, CRUD y logout', () => {
    // --- LOGIN UI  ---
    cy.visit('/login');
    loginForm.login(
      usuarios.validos.admin.email,
      usuarios.validos.admin.password
    );
    cy.url().should('include', '/store');

    // --- NAVEGACIÓN ---
    navbar.tiendaLink.click();
    cy.url().should('include', '/store');
    navbar.misOrdenesLink.click();
    cy.url().should('include', '/my-orders');
    navbar.adminPanelLink.click();
    cy.url().should('include', '/adm-store');
    navbar.inicioLink.click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    navbar.nosotrosLink.click();
    cy.url().should('include', '/about');

    // --- VALIDACIÓN DE FILTROS EN TIENDA ---
    cy.visit('/store');
    storePage.searchFor(products.premium.nombre);
    cy.wait(500);
    storePage.getProductCards().should('contain', products.premium.nombre);
    storePage.sortByPrice('asc');
    storePage.getProductPrices().then((prices) => {
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sortedPrices);
    });
    storePage.setPriceSliderMin(2000);
    cy.wait(500);
    storePage.getProductCards().should('not.contain', products.hacienda.nombre);

    // --- CRUD DE PRODUCTO ---
    navbar.adminPanelLink.click();
    cy.get('input[name="nombre"]').type(nombreProducto);
    cy.get('input[name="descripcion"]').type('Café tostado premium');
    cy.get('input[placeholder="Precio"]').type('500');
    cy.get('input[placeholder="Stock"]').type('10');
    cy.get('select[name="productBrand"]').select('Don Julio Premium');
    cy.get('select[name="productClass"]').select('Granos');
    cy.get('input[type="file"]').selectFile(filePath, { force: true });
    cy.get('img[alt="Vista previa"]').should('be.visible');
    cy.contains('button', 'Agregar Producto').click();
    cy.contains('Producto agregado correctamente').should('be.visible');

    // Edición del producto
    cy.visit('/adm-store');
    cy.contains('div.card', nombreProducto).within(() => {
      cy.contains('button', 'Editar').click();
    });
    cy.get('select[name="productBrand"]').select('Don Julio Premium');
    cy.get('select[name="productClass"]').select('Granos');
    cy.get('input[placeholder="Precio"]').clear().type('600');
    cy.get('input[type="file"]').selectFile(filePath, { force: true });
    cy.get('img[alt="Vista previa"]').should('be.visible');
    cy.contains('button', 'Actualizar Producto').click();
    cy.contains('Producto actualizado correctamente').should('be.visible');

    // Eliminación del producto
    cy.visit('/adm-store');
    cy.contains('div.card', nombreProducto).within(() => {
      cy.contains('button', 'Eliminar').click();
    });
    cy.get('div[role="dialog"]').within(() => {
      cy.contains('button', 'Eliminar').click({ force: true });
    });
    cy.contains('Producto eliminado correctamente').should('be.visible');

    // --- LOGOUT ---
    navbar.logoutButton.click();
    cy.url().should('include', '/login');
    navbar.loginLink.should('be.visible');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('user')).to.be.null;
    });
  });
});
