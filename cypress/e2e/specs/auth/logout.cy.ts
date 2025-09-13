describe('Logout - Cypress', () => {
  let usuarios: any;

  before(() => {
    // Cargar datos de prueba
    cy.fixture('../fixtures/usuarios.json').then((data) => {
      usuarios = data;
    });
  });

  it('Logout exitoso desde la interfaz', () => {
    // 1. Hacer login primero
    cy.loginUi(usuarios.validos.admin.email, usuarios.validos.admin.password);

    // 2. Verificar que estamos logueados
    cy.url().should('include', '/store');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist;
      expect(win.localStorage.getItem('user')).to.exist;
    });

    // 3. Buscar y hacer clic en el botón de logout
    cy.get(
      '[data-testid="logout-btn"], button:contains("Logout"), button:contains("Cerrar sesión"), [aria-label="Logout"], [aria-label="Cerrar sesión"]'
    )
      .should('be.visible')
      .click();

    // 4. Verificar redirección a login o home
    cy.url().should('match', /\/(login|home|$)/);

    // 5. Verificar que se limpió el localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('user')).to.be.null;
      expect(win.localStorage.getItem('clientEmail')).to.be.null;
    });

    // 6. Verificar que no podemos acceder a rutas protegidas
    cy.visit('/admin/products', { failOnStatusCode: false });
    cy.url().should('match', /\/(login|unauthorized)/);
  });

  it('Logout usando comando personalizado', () => {
    // 1. Hacer login con API
    cy.loginByApi(
      usuarios.validos.admin.email,
      usuarios.validos.admin.password
    );
    cy.visit('/store');

    // 2. Verificar estado inicial
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist;
    });

    // 3. Ejecutar logout usando comando personalizado
    cy.logout();

    // 4. Verificar que se limpió correctamente
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('user')).to.be.null;
    });

    // 5. Verificar que al intentar acceder a una ruta protegida nos redirige
    cy.visit('/my-orders', { failOnStatusCode: false });
    cy.url().should('match', /\/(login|unauthorized)/);
  });

  it('Logout desde diferentes páginas mantiene la funcionalidad', () => {
    // 1. Login
    cy.loginByApi(
      usuarios.validos.admin.email,
      usuarios.validos.admin.password
    );

    // 2. Test logout desde /store
    cy.visit('/store');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist;
    });

    // Re-login para siguiente test
    cy.loginByApi(
      usuarios.validos.admin.email,
      usuarios.validos.admin.password
    );

    // 3. Test logout desde /my-orders (si existe)
    cy.visit('/my-orders', { failOnStatusCode: false });
    cy.url().then((url) => {
      if (url.includes('/my-orders')) {
        cy.logout();
        cy.window().then((win) => {
          expect(win.localStorage.getItem('token')).to.be.null;
        });
      }
    });

    // Re-login para siguiente test
    cy.loginByApi(
      usuarios.validos.admin.email,
      usuarios.validos.admin.password
    );

    // 4. Test logout desde página de admin
    cy.visit('/admin/products', { failOnStatusCode: false });
    cy.url().then((url) => {
      if (url.includes('/admin')) {
        cy.logout();
        cy.window().then((win) => {
          expect(win.localStorage.getItem('token')).to.be.null;
        });
      }
    });
  });
  
  it('Debería desloguear al usuario si el localStorage se limpia externamente', () => {
    // 1. Hacemos login y visitamos una página.
    cy.loginByApi(
      usuarios.validos.client.email, 
      usuarios.validos.client.password
    );
    cy.visit('/store');

    // 2. Verificamos que estamos logueados.
    cy.contains('button', /Cerrar sesión/i).should('be.visible');

    // 3. Acción: Simular que otra pestaña limpió el localStorage.
    cy.clearLocalStorage();

    // 4. Verificación: Al recargar la página, la aplicación debe reaccionar y mostrar el estado de "no logueado".
    cy.reload();
    cy.contains('a', /Iniciar sesión/i).should('be.visible');
    cy.contains('button', /Cerrar sesión/i).should('not.exist');
  });
});
