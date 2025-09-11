# README-CYPRESS.md

## 🚀 Propósito
Instrucciones para instalar y ejecutar tests E2E con Cypress en el proyecto **Shopping Cart Frontend**.

## 📋 Requisitos
- Node.js >= 18
- npm o pnpm (recomendado)
- Aplicación backend corriendo (para tests completos)

## ⚙️ Instalación

### 1. Clonar repositorio:
```bash
git clone https://github.com/poc-e2e-testing/frontend-tp-poc.git
cd frontend-tp-poc
```

### 2. Instalar dependencias:
```bash
# Con pnpm (recomendado)
pnpm install

# Con npm - primera vez o desarrollo
npm install

```

### 3. Configurar variables de entorno:
```bash
# Copiar archivo de ejemplo
cp cypress.env.example.json cypress.env.json

# Editar cypress.env.json con tus valores
```

**Ejemplo de `cypress.env.json`:**
```json
{
  "BASE_URL": "http://localhost:5173",
  "API_URL": "http://localhost:3000/api",
  "TEST_USER_EMAIL": "test@ejemplo.com",
  "TEST_USER_PASSWORD": "123456",
  "TIMEOUT": 10000
}
```

## 📁 Estructura del proyecto
```
/cypress
  /e2e/                    # Tests E2E
    hola_mundo.cy.ts       # Test básico de smoke
    shopping-cart-test.cy.ts # Tests del carrito
  /fixtures/               # Datos de prueba
    usuarios-ejemplo.json  # Usuarios de prueba
  /support/               # Configuración y comandos
    commands.ts           # Comandos personalizados
    e2e.ts               # Configuración global
    index.d.ts           # Tipos TypeScript
cypress.config.ts         # Configuración principal
```

## 🏃‍♂️ Ejecutar tests localmente

### 1. Levantar la aplicación:
```bash
# Iniciar frontend
pnpm dev
# La app estará en http://localhost:5173 (o puerto disponible)
```

### 2. Ejecutar Cypress con interfaz gráfica:
```bash
# Con pnpm
pnpm run cypress:open

# Con npm
npm run cypress:open
```

### 3. Ejecutar tests sin interfaz (headless):
```bash
# Todos los tests
pnpm run cypress:run

# Test específico
pnpm cypress run --spec "cypress/e2e/hola_mundo.cy.ts"

# Solo en Chrome
pnpm cypress run --browser chrome
```

## 🧪 Tests disponibles

| Test | Descripción | Archivo |
|------|-------------|---------|
| **Hola Mundo** | Test básico de smoke | `hola_mundo.cy.ts` |


## 🔧 Comandos personalizados disponibles

Los comandos están definidos en `cypress/support/commands.ts` para simplificar tests del shopping cart:

### 🔐 **Autenticación**
```typescript
cy.loginUi('test@ejemplo.com', '123456')      // Login por UI (flujo completo)
cy.loginByApi('test@ejemplo.com', '123456')   // Login rápido por API
cy.logout()                                   // Limpia localStorage completo
```

### 🛒 **E-commerce**
```typescript
cy.addToCart(1, 2)        // Agrega 2 unidades del producto ID 1
cy.goToCheckout()         // Va al checkout con validaciones
```

### 🧪 **Ejemplo de uso**
```typescript
describe('Compra completa', () => {
  it('Usuario compra productos', () => {
    cy.loginByApi(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'))
    cy.visit('/store')
    cy.addToCart(1, 2)
    cy.goToCheckout()
    // ... completar compra
    cy.logout()
  })
})
```



### Archivos generados:
- **Videos:** `cypress/videos/` (solo en modo headless)
- **Screenshots:** `cypress/screenshots/` (cuando fallan tests)
- **Reportes:** `cypress/reports/` (si está configurado)

### Comandos útiles:
```bash
# Ejecutar con video habilitado
pnpm cypress run --record

# Solo tests que fallan
pnpm cypress run --spec "cypress/e2e/**/*" --reporter json

# Con browser específico
pnpm cypress run --browser firefox

# Debug mode
pnpm cypress open --env DEBUG=true
```

## 📚 Recursos adicionales

- [Documentación oficial de Cypress](https://docs.cypress.io)
- [Best Practices de Cypress](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app)

---
