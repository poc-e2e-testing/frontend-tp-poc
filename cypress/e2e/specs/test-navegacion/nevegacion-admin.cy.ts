describe('Navegación Post-Login - Cypress', () => {
  beforeEach(() => {
    // Login usando comando personalizado
    cy.loginByApi(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'))
  })

  it('Navegar entre secciones manteniendo sesión', () => {
    // Ir a Store
    cy.visit('/store')
    cy.url().should('include', '/store')
    
    // Ir a My Orders
    cy.visit('/my-orders')
    cy.url().should('include', '/my-orders')
    
    cy.visit('/my-profile')
    cy.url().should('include', '/my-profile')
    
    cy.visit('/admin/products')
    cy.url().should('include', '/admin/products')
    
    
    // Verificar que sesión se mantiene
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist
    })
  })
})