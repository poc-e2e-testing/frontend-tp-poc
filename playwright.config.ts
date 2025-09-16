import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Se actualiza testDir para que apunte a la carpeta raíz de los tests,
  // permitiendo que Playwright encuentre tanto los tests de 'setup' como los de 'specs'.
  testDir: './playwright/tests',

  fullyParallel: true, // Ejecutar tests en paralelo
  forbidOnly: !!process.env.CI, // Falla si quedó test.only en CI
  retries: process.env.CI ? 2 : 0, // Reintentos solo en CI
  workers: process.env.CI ? 1 : undefined, // Paralelismo en CI
  reporter: [['html', { outputFolder: 'playwright/playwright-report' }]], // Reporte en HTML

  use: {
    baseURL: 'http://localhost:5173', // URL base de tu frontend
    trace: 'on-first-retry', // Traza en fallos para debugging
    screenshot: 'only-on-failure', // Screenshot solo si falla
    video: 'retain-on-failure', // Video solo si falla
    headless: true, // Modo headless
  },

  projects: [
    // 1. Proyecto de Setup: Se ejecuta una sola vez para autenticar al usuario.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2. Proyectos de Navegadores: Ejecutan los tests funcionales.
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storageState.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\.spec\.ts/,
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'storageState.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\.spec\.ts/,
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'storageState.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\.spec\.ts/,
    },
  ],

  webServer: {
    command: 'pnpm run dev', // segun el script de arranque
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  outputDir: 'playwright/test-results',
});
