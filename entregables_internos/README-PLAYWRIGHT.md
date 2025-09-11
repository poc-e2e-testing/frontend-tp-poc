# Instructivo para la instalación  y configuracion de Playwright

### 1. Requisitos
- Node.js >20v o superior (node -v)
- Gestor de paquetes: pnpm instalado (pnpm -v)
- Proyecto frontend con React/Vite/Tailwind o similar
- Backend corriendo (para poder probar los flujos reales).
- Permisos para instalar dependencias

### 2. Instalación
1. Entrar en la raíz del repo del frontend.  

```bash
pnpm create playwright
```

2. El anterior comando Descarga el generador oficial de Playwright y realiza un wizard interactivo preguntando
3. TypeScript o JavaScript (por defecto TypeScript)
4. El directorio donde se guardarán los tests (por defecto /tests, pero nosotros usamos ./playwright/tests/).  
5. Opción de crear un workflow de GitHub Actions (puede ignorarse por ahora).
6. Descarga binarios de navegadores (Chromium, Firefox, WebKit) (por defecto yes).### 3. Configuración  
Para nuestro proyecto en particular configuramos playwright.config.ts con Typescript. 
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',          // Carpeta de tests
  fullyParallel: true,         // Ejecutar tests en paralelo
  forbidOnly: !!process.env.CI,// Falla si quedó test.only en CI
  retries: process.env.CI ? 2 : 0, // Reintentos solo en CI
  workers: process.env.CI ? 1 : undefined, // Paralelismo en CI
  reporter: [['list'], ['html', { open: 'always' }]], // En consola y html
  
  use: {
    baseURL: 'http://localhost:5173', // URL base de tu frontend
    trace: 'on-first-retry',          // Traza en fallos para debugging
    screenshot: 'only-on-failure',    // Screenshot solo si falla
    video: 'retain-on-failure',       // Video solo si falla
    headless: true,                   // Modo headless
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'pnpm run dev',           // script de arranque
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});

```
  
### Puntos clave:

- **testDir**: carpeta donde van los tests.
- **reporter**: formatos de reporte.  En nuestro caso, los lista en consola y luego abre un html en [localhost:9323/](http://localhost:9323/) donde se muestra el reporte de forma interactiva. Lista de tipos de reporte:  
	**list** (en consola, es el más rápido de visualizar),  
	**dot** (la salida son puntos (test aprobado) y F (fallo), permite integrarla con CI/CD),  
	**line** (cada test en una linea),  
	**json** (permite integrarlos con otras herramientas),  
	**junit** (para integracion con Jenkins, GitHub Actions) ,  
	**html** (conf por defecto del instalador, es visual y interactivo).
- **use**: config global 
	- **baseURL**: Permite usar rutas relativas en los test. Caso contrario en los test se especifica la ruta absoluta.
	- **trace**: Captura trazas de ejecución para debugging. Opciones: on (las graba), off (no las graba), retain-on-failure (solo si falla), on-first-retry (solo graba las del primer intento)
	- **headless**: Se ejecutan los navegadores en modo headless. Opciones: on (sin UI visible) off (con UI). 
- **screenshot**: Toma capturas de pantalla durante la ejecución de tests. Opciones: on (siempre), off (nunca), only-on-failure (solo si falla)
- **video**: Graba video mientras corren los test. on (siempre), off (nunca), retain-on-failure (solo cuando falla)
- **projects**: navegadores en los que se ejecutan los tests.
- **wevServer**: usa el script de arranque para levantar el frontend antes de hacer las pruebas.

  

### 4. Estructura del proyecto
Después de la instalación queda así:
```
├── ./frontend  
├── ./package.json  
├── ./playwright.config.ts  
├── ./tests/  
│   └── example.spec.ts
└── ./tests-examples/  
    └── demo-todo-app.spec.ts  
``` 

### 5. Ejecutar tests
Playwright te crea la carpeta y coloca unos test de ejemplo para realizar una prueba rápida si todo está correctamente instalado:  
```bash
pnpm exec playwright test
```

Ejecutar un test en particular:  
```bash
pnpm exec playwright test playwright/tests/common/example.spec.ts
```Ejecutar en un navegador específico:  
```bash
pnpm exec playwright test --project=firefox
```
  
### 6. Comandos personalizados

Agregar en package.json → sección scripts:
```json
"scripts": {
  "test-pw": "pnpm exec playwright test",
  "test-pw:headed": "pnpm exec playwright test --headed",
  "test-pw:firefox": "pnpm exec playwright test --project=firefox",
  "test-pw:ui": "pnpm exec playwright test --ui",
  "test-pw:debug": "pnpm exec playwright test --debug",
  "test-pw:report": "pnpm exec playwright show-report"
}
```

Ejemplo de ejecución:  
```bash
pnpm run test-pw:headed
```
  

### 7. Ejemplos

Ejemplo de test básico en playwright/tests/common/example.spec.ts:
```ts
import { test, expect } from '@playwright/test';

test('Wikipedia homepage test', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
  await expect(page).toHaveTitle(/Wikipedia/);
  const heading = page.locator('div.central-textlogo h1');
  await expect(heading).toContainText('Wikipedia');
});
```

Ejemplo de ejecución:  
```bash
pnpm exec playwright test tests/hello.spec.ts
```

### 8. Comandos útiles

- pnpm exec playwright test → correr todos los tests
- pnpm exec playwright test playwright/tests/common/example.spec.ts → correr un test específico
- pnpm exec playwright test playwright/tests/common/ → correr todos los tests comunes
- pnpm exec playwright test playwright/tests/specs/ → correr tests por funcionalidad (cuando se agreguen)
- pnpm exec playwright test --project=firefox → solo en Firefox
- pnpm exec playwright test --headed → abrir navegador visible
- pnpm exec playwright test --ui → interfaz interactiva de tests
- pnpm exec playwright test --debug → modo debug paso a paso
- pnpm exec playwright show-report → abrir reporte HTML
- pnpm exec playwright codegen http://localhost:5173 → grabar interacciones y generar código de test

**Referencias: **

Documentacion oficial de playwright: [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
