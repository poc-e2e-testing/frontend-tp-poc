import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // URL base - Cypress automáticamente lee cypress.env.json
    baseUrl: 'http://localhost:5173', 
    
    // Patrón para encontrar tus tests
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',

    // Archivo de soporte (TypeScript)
    supportFile: 'cypress/support/e2e.ts',

    // Configuraciones de eventos
    setupNodeEvents(on, config) {
      // Si cypress.env.json tiene BASE_URL, lo usa automáticamente
      if (config.env.BASE_URL) {
        config.baseUrl = config.env.BASE_URL
      }
      
      // Log para debug
      console.log('🚀 Cypress configurado con baseUrl:', config.baseUrl)
      console.log('🌍 Variables de entorno:', config.env)
      return config
    },

    // Configuraciones de grabación
    video: true,                        // ✅ Grabar videos de todos los tests
    videosFolder: 'cypress/videos',     // Carpeta donde guardar videos
    videoCompression: 15,               // Compresión (0-51, menor = mejor calidad)
    screenshotOnRunFailure: true,       // Screenshots si falla
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
  },
})
