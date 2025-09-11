// cypress/support/index.d.ts
declare namespace Cypress {
  interface Chainable {
    /**
     * Login mediante UI (simula el flujo real del usuario)
     * @param email - Email del usuario
     * @param password - Contraseña del usuario
     */
    loginUi(email: string, password: string): Chainable<void>

    /**
     * Login directo contra API (más rápido para setup de tests)
     * @param email - Email del usuario  
     * @param password - Contraseña del usuario
     */
    loginByApi(email: string, password: string): Chainable<void>

    /**
     * Logout y limpia el localStorage
     */
    logout(): Chainable<void>

    /**
     * Agregar producto al carrito
     * @param productId - ID del producto
     * @param quantity - Cantidad (default: 1)
     */
    addToCart(productId: number, quantity?: number): Chainable<void>

    /**
     * Ir al checkout con validaciones
     */
    goToCheckout(): Chainable<void>
  }
}
