/**
 * Test E2E unificado para el flujo completo de la app Don Julio Cafe.
 * Valida login, navegación, filtros, CRUD de producto y logout.
 */
import { navbar } from '../../pages/Navbar';
import { storePage } from '../../pages/StorePage';
import { loginForm } from '../../pages/LoginForm';
import { ProductForm } from '../../pages/ProductForm';
import { ProductCard } from '../../pages/ProductCard';

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
    const form = new ProductForm();
    cy.visit('/adm-store');
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

    const card = new ProductCard(nombreProducto);
    cy.visit('/adm-store');
    card.expectVisible();
    card.expectPrice('500');

    cy.log(`**Editando producto: ${nombreProducto}**`);
    cy.visit('/adm-store');
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
    cy.visit('/adm-store');
    card.expectVisible();
    card.expectPrice('600');

    cy.log(`**Eliminando producto: ${nombreProducto}**`);
    cy.visit('/adm-store');
    card.expectVisible();
    card.expectPrice('600');
    card.clickDelete();
    card.confirmDelete();
    cy.visit('/adm-store');
    cy.contains('div.card', nombreProducto).should('not.exist');
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
