import { test as setup } from '@playwright/test';
import { AuthUtils } from '../../utils/AuthUtils';
// Se añade 'assert { type: 'json' }' para cumplir con el estándar de módulos ES.
import usuarios from '../../fixtures/usuarios.json' assert { type: 'json' };

const adminFile = 'storageState.json';

setup('autenticar como administrador', async ({ page }) => {
  const authUtils = new AuthUtils(page);

  await authUtils.loginByApi(
    usuarios.validos.admin.email,
    usuarios.validos.admin.password
  );

  await page.context().storageState({ path: adminFile });
});