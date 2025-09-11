describe('Hola mundo - test de sanity', () => {
  it('visita la home y verifica texto visible', () => {
    cy.visit('/');
    cy.contains('h1', 'Bienvenido').should('be.visible'); // adaptar texto de la app
  });
});
