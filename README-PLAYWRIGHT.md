## 1. Requisitos

Node.js v18 o superior (node -v)

pnpm instalado (pnpm -v)

Proyecto frontend con React/Vite/Tailwind o similar

Backend corriendo (para poder probar los flujos reales)

Permisos para instalar dependencias

## 2. Instalación

Entrar en la raíz del repo del frontend.

Ejecutar:

pnpm create playwright

Este comando:

Instala Playwright.

Pregunta el directorio donde se guardarán los tests (por defecto /tests).

Opción de crear un workflow de CI (puede ignorarse por ahora).

Descarga binarios de navegadores (Chromium, Firefox, WebKit).

## 3. Configuración

Archivo playwright.config.js ejemplo básico:
// playwright.config.js
const config = {
testDir: './tests',
timeout: 30 \* 1000,
retries: 1,
reporter: [['list'], ['html', { open: 'never' }]],
use: {
baseURL: 'http://localhost:5173',
trace: 'on-first-retry',
headless: true,
},
projects: [
{ name: 'chromium' },
{ name: 'firefox' },
{ name: 'webkit' }
],
};

module.exports = config;

Puntos clave:
testDir: carpeta donde van los tests.

retries: reintentos si un test falla.

reporter: formatos de reporte (consola + HTML).

use: config global (baseURL, headless, trace, etc.).

projects: navegadores en los que se ejecutan los tests.

## 4. Estructura del proyecto

Después de la instalación queda algo así:
/frontend
├── package.json
├── playwright.config.js
├── tests/
│ └── hello.spec.js
├── tests-examples/
│ └── demo-todo-app.spec.js
└── ...

## 5. Ejecutar tests

Ejemplo de ejecución básica:
pnpm exec playwright test

Ejecutar un test en particular:
pnpm exec playwright test tests/hello.spec.js

Ejecutar en un navegador específico:
pnpm exec playwright test --project=firefox

## 6. Comandos personalizados

Agregar en package.json → sección scripts:
"scripts": {
"test:e2e": "playwright test",
"test:e2e:headed": "playwright test --headed",
"test:e2e:firefox": "playwright test --project=firefox",
"test:e2e:ui": "playwright test --ui",
"test:e2e:debug": "playwright test --debug",
"test:e2e:report": "playwright show-report"
}

Ejemplo de ejecución:
pnpm run test:e2e:headed

## 7. Ejemplos

Ejemplo de test hola mundo en tests/hello.spec.js:
const { test, expect } = require('@playwright/test');

test('hola mundo: la página carga', async ({ page }) => {
await page.goto('/');
await expect(page.locator('body')).toBeVisible();
});

## 8. Comandos útiles

pnpm exec playwright test → correr todos los tests

pnpm exec playwright test --project=firefox → solo en Firefox

pnpm exec playwright test --headed → abrir navegador visible

pnpm exec playwright test --ui → interfaz interactiva de tests

pnpm exec playwright test --debug → modo debug paso a paso

pnpm exec playwright show-report → abrir reporte HTML

pnpm exec playwright codegen http://localhost:5173 → grabar interacciones y generar código de test
