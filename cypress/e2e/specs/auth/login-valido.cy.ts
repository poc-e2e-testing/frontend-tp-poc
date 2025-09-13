
describe('Login Válido - Cypress', () => {
  let usuarios: any

  before(() => {
    // Cargar datos de prueba
    cy.fixture('../fixtures/usuarios.json').then((data) => {
      usuarios = data
    })
  })

  it('Login exitoso con usuario válido', () => {
    // 1. Ir a login
    cy.visit('/login')
    
    // 2. Completar formulario
    cy.get('input[type="email"]').type(usuarios.validos.admin.email)
    cy.get('input[type="password"]').type(usuarios.validos.admin.password)
    cy.get('button[type="submit"]').click()
    
    // 3. Verificar redirección
    cy.url().should('include', '/store')
    
    // 4. Verificar localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist
    })
  })
})