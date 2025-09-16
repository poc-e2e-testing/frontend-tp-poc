/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginUi(email: string, password: string): void;
    loginByApi(email: string, password: string): void;
    logout(): void;
  }
}

// LOGIN mediante UI (simula el flujo real del usuario)
Cypress.Commands.add('loginUi', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();

  // Esperar redirección exitosa a /store
  cy.url().should('include', '/store');
  cy.window().then((win) => {
    expect(win.localStorage.getItem('token')).to.exist;
    expect(win.localStorage.getItem('user')).to.exist;
  });
});

// Login mediante API (sin UI, más rápido)
Cypress.Commands.add('loginByApi', (email, password) => {
  const apiUrl = Cypress.env('API_URL')

  cy.session(
    [email, password], // ID único para la sesión
    () => {
      cy.request('POST', `${apiUrl}/api/auth/login`, { email, password }).then(
        (loginResp) => {
          expect(loginResp.status).to.eq(200)
          const token = loginResp.body.token

          return cy
            .request({
              method: 'GET',
              url: `${apiUrl}/api/auth/me`,
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((meResp) => {
              expect(meResp.status).to.eq(200)
              window.localStorage.setItem('token', token)
              window.localStorage.setItem(
                'user',
                JSON.stringify(meResp.body.user)
              )
              window.localStorage.setItem(
                'clientEmail',
                meResp.body.user.email
              )
            })
        }
      )
    },
    {
      cacheAcrossSpecs: true
    }
  )
})

// Logout comando
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('token')
    win.localStorage.removeItem('user')
    win.localStorage.removeItem('clientEmail')
    win.localStorage.removeItem('lastOrderId')

    win.dispatchEvent(new Event('storage'))
  });
  cy.window().then((win) => {

    expect(win.localStorage.getItem('token')).to.be.null
    expect(win.localStorage.getItem('user')).to.be.null
    expect(win.localStorage.getItem('clientEmail')).to.be.null

  })
})
