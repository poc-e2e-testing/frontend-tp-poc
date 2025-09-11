/// <reference types="cypress" />

// 🔐 LOGIN mediante UI (simula el flujo real del usuario)
Cypress.Commands.add('loginUi', (email, password) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  
  // Esperar redirección exitosa a /store
  cy.url().should('include', '/store')
  cy.window().then((win) => {
    expect(win.localStorage.getItem('token')).to.exist
    expect(win.localStorage.getItem('user')).to.exist
  })
})

// 🚀 LOGIN directo contra API (más rápido para setup de tests)
Cypress.Commands.add('loginByApi', (email, password) => {
  const apiUrl = Cypress.env('API_URL')
  
  cy.request('POST', `${apiUrl}/api/auth/login`, {
    email: email,
    password: password,
  }).then((loginResp) => {
    expect(loginResp.status).to.eq(200)
    const token = loginResp.body.token
    
    // Obtener datos del usuario
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/auth/me`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((meResp) => {
      expect(meResp.status).to.eq(200)
      
      // Simular el localStorage como tu app
      cy.window().then((win) => {
        win.localStorage.setItem('token', token)
        win.localStorage.setItem('user', JSON.stringify(meResp.body.user))
        win.localStorage.setItem('clientEmail', meResp.body.user.email)
      })
    })
  })
})

// 🚪 LOGOUT (limpia todo)
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    // Limpiar localStorage
    win.localStorage.removeItem('token')
    win.localStorage.removeItem('user')
    win.localStorage.removeItem('clientEmail')
    win.localStorage.removeItem('lastOrderId')
    
    // Disparar evento storage
    win.dispatchEvent(new Event('storage'))
  })
  
  // Verificar que se limpió
  cy.window().then((win) => {
    expect(win.localStorage.getItem('token')).to.be.null
    expect(win.localStorage.getItem('user')).to.be.null
  })
})

// 🛒 AGREGAR producto al carrito
Cypress.Commands.add('addToCart', (productId, quantity) => {
  const qty = quantity || 1
  
  cy.get(`[data-testid="product-${productId}"]`).within(() => {
    if (qty > 1) {
      cy.get('[data-testid="quantity-input"]').clear().type(qty.toString())
    }
    cy.get('[data-testid="add-to-cart-btn"]').click()
  })
})

// 🛍️ IR al checkout
Cypress.Commands.add('goToCheckout', () => {
  // Abrir carrito
  cy.get('[aria-label="Ver carrito"]').click()
  
  // Verificar items
  cy.get('[data-testid="cart-items"]').should('exist')
  
  // Ir a checkout
  cy.contains('button', 'Checkout').click()
  
  // Verificar URL
  cy.url().should('include', '/checkout')
})
