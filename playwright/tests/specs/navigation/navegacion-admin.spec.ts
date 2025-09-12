import { test, expect } from '@playwright/test'
import usuarios from '../../../fixtures/usuarios.json' with { type: 'json' }

test.describe('Navegación Post-Login - Playwright', () => {
  
  test('Navegar entre secciones manteniendo sesión', async ({ page }) => {
    // Hacer login primero
    await page.goto('/login')
    await page.fill('input[type="email"]', usuarios.validos.admin.email)
    await page.fill('input[type="password"]', usuarios.validos.admin.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/store')
    
    // Ir a Store
    await page.goto('/store')
    await expect(page).toHaveURL(/.*store/)
    
    // Ir a My Orders
    await page.goto('/my-orders')
    await expect(page).toHaveURL(/.*my-orders/)
    
    // Verificar que sesión se mantiene
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeTruthy()
  })
})