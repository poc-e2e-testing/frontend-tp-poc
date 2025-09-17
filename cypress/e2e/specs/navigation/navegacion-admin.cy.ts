import { navbar } from "../../pages/Navbar"

let usuarios;

before(() => {
  cy.fixture('usuarios.json').then((data) => {
    usuarios = data;
  });
});

describe('Navegación Post-Login - Cypress', () => {
  beforeEach(() => {
    cy.loginByApi(usuarios.validos.admin.email, usuarios.validos.admin.password)
    cy.visit('/') 
  })

  it('Navegar entre secciones manteniendo sesión', () => {
    navbar.tiendaLink.click()
    cy.url().should('include', '/store')
    
    navbar.misOrdenesLink.click()
    cy.url().should('include', '/my-orders')

    navbar.adminPanelLink.click()
    cy.url().should('include', '/adm-store')
    
    navbar.inicioLink.click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    navbar.nosotrosLink.click()
    cy.url().should('include', '/about')
    
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist
    })
  })
})