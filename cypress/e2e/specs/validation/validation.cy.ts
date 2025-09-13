describe('Pruebas de Filtros en la Tienda - Cypress', () => {

  beforeEach(() => {
    // Visitamos la página de la tienda antes de cada test.
    cy.visit('/store');
    // Esperamos a que los productos iniciales se carguen.
    // Buscamos que haya al menos una tarjeta de producto visible.
    cy.get('.card').should('be.visible');
  });

  it('Debería filtrar los productos correctamente al usar el buscador de texto', () => {
    // Datos de prueba (sabemos por el seeder.ts que existen estos productos)
    const productoPremium = 'Don Julio Premium Granos 500g';
    const productoHacienda = 'Hacienda Del Valle Molido 250g';
    const terminoBusqueda = 'Premium';

    // 1. Acción: Encontrar el input de búsqueda y escribir en él.
    cy.get('input[placeholder="Buscar productos"]').type(terminoBusqueda);

    cy.get('button').contains('Buscar').click();

    // 2. Aserción: Verificar el resultado.
    cy.contains('.card', productoPremium).should('be.visible');
    cy.contains('.card', productoHacienda).should('not.exist');
  });

  it('Debería ordenar los productos por precio de menor a mayor', () => {
    // 1. Acción: Seleccionar la opción "Menor a mayor" en el dropdown.
    cy.get('select#order').select('asc'); // 'asc' es el value de la opción en el HTML.

    // Damos un pequeño respiro para que React re-renderice
    cy.wait(500);

    // 2. Aserción: Verificar que los precios están ordenados.
    const prices: number[] = [];
    cy.get('.card:visible .ms-2.text-muted')
      .each(($el) => {
        // Obtenemos el texto del precio, lo limpiamos (quitamos '$' y ',') y lo convertimos a número.
        const priceText = $el.text().replace(/[$,]/g, '');
        prices.push(parseFloat(priceText));
      })
      .then(() => {
        // Después de recolectar todos los precios, los comparamos.
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).to.deep.equal(sortedPrices);
      });
  });

  it('Debería ordenar los productos por precio de mayor a menor', () => {
    // 1. Acción: Seleccionar la opción "Mayor a menor" en el dropdown.
    cy.get('select#order').select('desc');

    // Damos un pequeño respiro para que React re-renderice
    cy.wait(500);

    // 2. Aserción: Verificar que los precios están ordenados.
    const prices: number[] = [];
    cy.get('.card:visible .ms-2.text-muted')
      .each(($el) => {
        // Obtenemos el texto del precio, lo limpiamos (quitamos '$' y ',') y lo convertimos a número.
        const priceText = $el.text().replace(/[$,]/g, '');
        prices.push(parseFloat(priceText));
      })
      .then(() => {
        // Después de recolectar todos los precios, los comparamos.
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).to.deep.equal(sortedPrices);
      });
  });

  it('Debería filtrar por rango de precios usando el slider', () => {
    const productoPremium = 'Don Julio Premium Granos 500g';
    const productoHacienda = 'Hacienda Del Valle Molido 250g';

    // 1. Acción: Mover el manejador izquierdo del slider hacia la derecha para subir el precio minimo a 2000 o más.
    // `{rightarrow}` simula presionar la tecla de flecha derecha. Lo repetimos 20 veces.
    cy.get('.rc-slider-handle').eq(0) // .eq(0) selecciona el primer manejador (el de la izquierda).
      .click()
      .type('{rightarrow}'.repeat(20))

    cy.contains('.card', productoHacienda).should('not.exist');
    cy.contains('.card', productoPremium).should('be.visible');
  });
  
});