import { test, expect } from '@playwright/test'
import usuarios from '../../fixtures/usuarios.json' with { type: 'json' }

test.describe('Login Inválido - Playwright', () => {
  test('Login falla con email incorrecto', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[type="email"]', usuarios.invalidos.emailIncorrecto.email)
    await page.fill('input[type="password"]', usuarios.invalidos.emailIncorrecto.password)
    await page.click('button[type="submit"]')
    
    // Verificar que NO redirige
    await expect(page).toHaveURL(/.*login/)
    
    // Verificar mensaje de error
    await expect(page.locator('text=Cliente no encontrado')).toBeVisible()
  })
})