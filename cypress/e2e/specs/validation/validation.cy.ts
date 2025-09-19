/**
 * Test de validación de filtros en la tienda.
 * Valida búsqueda, ordenamiento y filtrado por rango de precios.
 */
import { storePage } from '../../pages/StorePage';

describe('Pruebas de Filtros en la Tienda - Cypress', () => {
  let products: any;

  beforeEach(() => {
    // Cargamos nuestro fixture para tenerlo disponible en los tests.
    cy.fixture('product.json').then((data) => {
      products = data;
    });

    // Interceptamos las llamadas a la API para sincronizar las pruebas.
    cy.intercept('GET', '**/api/products*').as('apiProducts');

    // Visitamos la página de la tienda.
    cy.visit('/store');

    // Esperamos a que la carga inicial de productos finalice.
    cy.wait('@apiProducts');

    storePage.getProductCards().should('have.length.at.least', 1);
    storePage.sortSelect.should('be.visible');
    storePage.priceSliderHandleMin.should('be.visible');
  });

  // Nota: Usamos 'function ()' en lugar de '() =>' para poder usar 'products' del fixture.
  /**
   * Debe filtrar los productos correctamente al usar el buscador de texto.
   */
  it('Debería filtrar los productos correctamente al usar el buscador de texto', function () {
    const productoHacienda = products.hacienda;
    const productoPremium = products.premium;

    // 1. Acción: Usamos el método del POM para buscar.
    storePage.searchFor(productoPremium.nombre);
    cy.wait('@apiProducts');

    // 2. Aserción: Verificamos que solo el producto buscado es visible.
    storePage.getProductCards().should('have.length', 1);
    storePage.getProductCards().should('contain', productoPremium.nombre);
    storePage.getProductCards().should('not.contain', productoHacienda.nombre);
  });

  /**
   * Debe mantener el término de búsqueda en el input después de buscar.
   */
  it('Debería mantener el término de búsqueda en el input después de buscar', function () {
    const terminoBusqueda = 'Premium';

    // 1. Acción: Usamos el método del POM para buscar.
    storePage.searchFor(terminoBusqueda);
    cy.wait('@apiProducts'); // Esperamos a que la búsqueda finalice

    // 2. Aserción: Verificamos que el input de búsqueda AÚN CONTIENE el valor buscado.
    // Esta es la validación clave de la buena práctica de UX.
    storePage.searchInput.should('have.value', terminoBusqueda);
  });

  /**
   * Debe ordenar los productos por precio de menor a mayor.
   */
  it('Debería ordenar los productos por precio de menor a mayor', () => {
    // 1. Acción: Seleccionar la opción "Menor a mayor" usando el POM.
    storePage.sortByPrice('asc');
    cy.wait('@apiProducts');

    // 2. Aserción: Usamos el helper del POM para obtener los precios y verificarlos.
    storePage.getProductPrices().then((prices) => {
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sortedPrices);
    });
  });

  /**
   * Debe ordenar los productos por precio de mayor a menor.
   */
  it('Debería ordenar los productos por precio de mayor a menor', () => {
    // 1. Acción: Seleccionar la opción "Mayor a menor" usando el POM.
    storePage.sortByPrice('desc');
    cy.wait('@apiProducts');

    // 2. Aserción: Verificamos el orden descendente.
    storePage.getProductPrices().then((prices) => {
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).to.deep.equal(sortedPrices);
    });
  });

  /**
   * Debe filtrar por rango de precios usando el slider.
   */
  it('Debería filtrar por rango de precios usando el slider', function () {
    const productoPremium = products.premium; // Precio: 2500
    const productoHacienda = products.hacienda; // Precio: 1800

    // 1. Acción: Mover el slider para establecer un precio mínimo de ~2000.
    storePage.setPriceSliderMin(2000);

    // Esperar que se carguen los productos en la vista
    cy.wait('@apiProducts');

    // 2. Aserción: El producto más barato ya no debe ser visible.
    storePage.getProductCards().should('contain', productoPremium.nombre);
    storePage.getProductCards().should('not.contain', productoHacienda.nombre);
  });
});
