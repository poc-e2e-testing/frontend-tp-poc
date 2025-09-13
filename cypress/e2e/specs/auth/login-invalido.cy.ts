describe('Login Inválido - Cypress', () => {
  let usuarios: any

  before(() => {
    cy.fixture('../fixtures/usuarios.json').then((data) => {
      usuarios = data
    })
  })

  it('Login falla con email incorrecto', () => {
    cy.visit('/login')
    
    cy.get('input[type="email"]').type(usuarios.invalidos.emailIncorrecto.email)
    cy.get('input[type="password"]').type(usuarios.invalidos.emailIncorrecto.password)
    cy.get('button[type="submit"]').click()
    
    // Verificar que NO redirige
    cy.url().should('include', '/login')
    
    // Verificar mensaje de error
    cy.contains('Cliente no encontrado').should('be.visible')
  })
})