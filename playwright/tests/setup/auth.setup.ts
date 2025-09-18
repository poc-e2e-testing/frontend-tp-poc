import { test as setup } from '@playwright/test';
import { AuthUtils } from '../../utils/AuthUtils';
import usuarios from '../../fixtures/usuarios.json' assert { type: 'json' };

const adminFile = 'storageState.json';

/**
 * Setup: Autentica como administrador y guarda el estado de sesión.
 * @param {{ page: import('@playwright/test').Page }} param0
 */
setup('autenticar como administrador', async ({ page }) => {
  const authUtils = new AuthUtils(page);

  await authUtils.loginByApi(
    usuarios.validos.admin.email,
    usuarios.validos.admin.password
  );

  await page.context().storageState({ path: adminFile });
});