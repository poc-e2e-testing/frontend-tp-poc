import { test, expect } from '@playwright/test'
import usuarios from '../../../fixtures/usuarios.json' with { type: 'json' }

test.describe('Login Válido - Playwright', () => {
  test('Login exitoso con usuario válido', async ({ page }) => {
    // 1. Ir a login
    await page.goto('/login')
    
    // 2. Completar formulario
    await page.fill('input[type="email"]', usuarios.validos.admin.email)
    await page.fill('input[type="password"]', usuarios.validos.admin.password)
    await page.click('button[type="submit"]')
    
    // 3. Verificar redirección
    await expect(page).toHaveURL(/.*store/)
    
    // 4. Verificar localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeTruthy()
  })
})