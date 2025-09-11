import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests', // Carpeta de tests
  fullyParallel: true, // Ejecutar tests en paralelo
  forbidOnly: !!process.env.CI, // Falla si quedó test.only en CI
  retries: process.env.CI ? 2 : 0, // Reintentos solo en CI
  workers: process.env.CI ? 1 : undefined, // Paralelismo en CI
  reporter: [['list'], ['html', { open: 'always' }]], // Reporte en HTML

  use: {
    baseURL: 'http://localhost:5173', // URL base de tu frontend
    trace: 'on-first-retry', // Traza en fallos para debugging
    screenshot: 'only-on-failure', // Screenshot solo si falla
    video: 'retain-on-failure', // Video solo si falla
    headless: true, // Modo headless
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'pnpm run dev', // segun el script de arranque
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
