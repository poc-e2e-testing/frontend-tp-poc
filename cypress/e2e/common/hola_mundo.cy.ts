/**
 * Prueba de sanity para la home.
 * Verifica que el texto de bienvenida esté visible en la página principal.
 */
describe('Hola mundo - test de sanity', () => {
  /**
   * Visita la home y verifica que el encabezado principal sea visible.
   */
  it('visita la home y verifica texto visible', () => {
    cy.visit('/');
    cy.contains('h1', 'Bienvenido').should('be.visible');
  });
});
