import { test, expect } from '@playwright/test'
import { getNavbar } from '../../../pages/Navbar'

test.describe('Navegación Post-Login - Playwright', () => {

  test('Navegar entre secciones manteniendo sesión', async ({ page }) => {
    const navbar = getNavbar(page)
    await page.goto('/')

    await navbar.tiendaLink.click()
    await expect(page).toHaveURL(/.*store/)

    await navbar.misOrdenesLink.click()
    await expect(page).toHaveURL(/.*my-orders/)

    await navbar.adminPanelLink.click()
    await expect(page).toHaveURL(/.*adm-store/)

    await navbar.inicioLink.click()
    await expect(page).toHaveURL((url) => {
      return url.pathname === '/' 
    })

    await navbar.nosotrosLink.click()
    await expect(page).toHaveURL(/.*about/)

    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeTruthy()
  })
})