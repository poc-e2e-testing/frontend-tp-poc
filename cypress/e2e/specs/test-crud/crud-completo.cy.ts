/**
 * Test E2E para el CRUD de producto en Don Julio Cafe.
 * Valida la creación, edición y eliminación de productos.
 */
import { ProductForm } from '../../pages/ProductForm';
import { ProductCard } from '../../pages/ProductCard';

describe('CRUD de producto en Don Julio Cafe', () => {
  const filePath = 'cypress/fixtures/cafe.jpg';
  let nombreProducto: string;
  let admin: any;

  before(() => {
    // Generar nombre único una sola vez
    nombreProducto = `Café Dorado ${Math.floor(Math.random() * 100000)}`;

    cy.fixture('usuarios.json').then((data) => {
      admin = data;
    });
  });

  beforeEach(() => {
    // Prepara el estado antes de cada test: inicia sesión vía API.
    // cy.session() optimiza esto para que sea casi instantáneo después de la primera vez.
    cy.loginByApi(admin.validos.admin.email, admin.validos.admin.password);
    cy.visit('/adm-store');
  });

  /**
   * Debe crear un producto correctamente.
   */
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
    cy.visit('/adm-store');
    card.expectVisible();
    card.expectPrice('500');
  });

  /**
   * Debe editar el producto creado.
   */
  it('2. Editar producto', () => {
    const form = new ProductForm();
    const card = new ProductCard(nombreProducto);

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

    // Verificar que se actualizó
    cy.visit('/adm-store');
    card.expectVisible();
    card.expectPrice('600');
  });

  /**
   * Debe eliminar el producto creado.
   */
  it('3. Eliminar producto', () => {
    const card = new ProductCard(nombreProducto);

    cy.visit('/adm-store');
    card.expectVisible();
    card.expectPrice('600');

    card.clickDelete();
    card.confirmDelete();

    // Verificar que se eliminó
    cy.visit('/adm-store');
    cy.contains('div.card', nombreProducto).should('not.exist');
  });
});
