Este documento justifica las decisiones de refactorización tomadas en los flujos de prueba de **Logout**. El objetivo es demostrar cómo la aplicación de las buenas prácticas oficiales de cada framework mejora la calidad, mantenibilidad y eficiencia de las pruebas, proporcionando una base sólida para la comparación.

---

#### **1. Gestión de la Sesión: Aislamiento y Eficiencia del Login**

*   **La Buena Práctica:** Evitar realizar el login a través de la UI antes de cada test. El estado de "usuario autenticado" debe establecerse de la forma más rápida y robusta posible, generalmente de manera programática.

*   **El Problema Identificado:** El test original `logout.cy.ts` usaba `cy.loginUi()`, y el de Playwright también se basaba en un login por UI. Esto hacía que las pruebas fueran lentas (navegando, escribiendo en campos, esperando respuestas) y frágiles (dependientes de la UI de login para probar el logout).

*   **La Solución en Cypress: `cy.session()`**
    *   **Implementación:** Se refactorizó el comando `cy.loginByApi` para envolver la lógica de la llamada a la API dentro de `cy.session()`.
    *   **¿Por qué esta solución?** `cy.session()` es la herramienta idiomática de Cypress para la gestión de sesiones. La primera vez que se ejecuta, realiza el login y cachea automáticamente el estado del navegador (localStorage, cookies, etc.) en memoria. En las siguientes ejecuciones de tests, en lugar de volver a llamar a la API, restaura instantáneamente la sesión desde la caché. Esto cumple con la buena práctica de controlar el estado de la aplicación de forma programática y eficiente.
    *   **Referencia en la Documentación:**
        *   [**Cypress Docs: `cy.session()`**](https://docs.cypress.io/api/commands/session)
        *   [**Cypress Best Practices: Logging In**](https://docs.cypress.io/app/core-concepts/best-practices#When-logging-in)

*   **La Solución en Playwright: Proyectos de Setup y `storageState`**
    *   **Implementación:** Se creó un "proyecto de setup" (`auth.setup.ts`) que se ejecuta una única vez antes de toda la suite. Este test se loguea vía API y guarda el estado de la sesión en un archivo `storageState.json`. Los proyectos de pruebas funcionales se configuraron en `playwright.config.ts` para cargar este archivo.
    *   **¿Por qué esta solución?** Esta es la estrategia recomendada por Playwright para un aislamiento y una eficiencia máximos. Desacopla completamente la preparación del estado de la ejecución de los tests. Cada test se inicia en un navegador nuevo que ya tiene el estado de sesión cargado, eliminando cualquier tipo de login repetitivo y garantizando la máxima velocidad.
    *   **Referencia en la Documentación:**
        *   [**Playwright Docs: Authentication - Setup Project**](https://playwright.dev/docs/auth#basic-shared-account-in-all-tests)

---

#### **2. Abstracción de la UI: Page Object Model (POM)**

*   **La Buena Práctica:** Separar la lógica de los tests de los detalles de implementación de la UI. Los tests no deben saber "cómo" encontrar un elemento (el selector), solo "qué" quieren hacer (la acción).

*   **El Problema Identificado:** Los selectores, especialmente el del botón de logout, estaban definidos directamente dentro del archivo de prueba. Eran largos, compuestos y frágiles, mezclando `data-testid`, `contains` y `aria-label`.

*   **La Solución en Cypress y Playwright: Clases de Página**
    *   **Implementación:** Se creó un archivo `Navbar.ts` tanto en la estructura de Cypress (`cypress/e2e/pages/`) como en la de Playwright (`playwright/pages/`). Esta clase ahora contiene los localizadores de los elementos de la barra de navegación y los métodos que representan las acciones del usuario.
    *   **¿Por qué esta solución?** El POM es un patrón de diseño estándar en la industria que resuelve problemas de mantenibilidad. Si un selector cambia, solo se modifica en un archivo (`Navbar.ts`), en lugar de en todos los tests que lo usan. Además, hace que el código del test sea mucho más legible y declarativo.
    *   **Referencia en la Documentación:**
        *   [**Playwright Docs: Page Object Models (POM)**](https://playwright.dev/docs/pom)
        *   (Cypress no tiene una página dedicada al POM, pero lo recomienda implícitamente en sus guías sobre cómo organizar proyectos complejos y en su documentación sobre "App Actions", que es un concepto relacionado).

---

#### **3. Selectores Robustos: `data-testid`**

*   **La Buena Práctica:** Utilizar selectores que no estén acoplados a atributos propensos a cambiar, como estilos CSS, texto o estructura del DOM.

*   **El Problema Identificado:** El selector de logout original era un claro ejemplo de este antipatrón, ya que dependía del texto "Cerrar sesión", que podría cambiar por una traducción o un rediseño.

*   **La Solución en Cypress y Playwright: `getByTestId`**
    *   **Implementación:** Se definieron los localizadores en los POM para usar `[data-testid="..."]` (en Cypress) y `page.getByTestId('...')` (en Playwright). Esto requiere que el equipo de desarrollo añada estos atributos a los elementos clave en el código de la aplicación.
    *   **¿Por qué esta solución?** Los atributos `data-*` son el "contrato" entre el desarrollo y QA. No afectan la funcionalidad ni el estilo y están diseñados específicamente para ser ganchos de prueba estables. Ambos frameworks los consideran la estrategia de selección de más alta prioridad.
    *   **Referencia en la Documentación:**
        *   [**Cypress Best Practices: Selecting Elements**](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements)
        *   [**Playwright Docs: Locators - By Test ID**](https://playwright.dev/docs/locators#locate-by-test-id)

---

#### **4. Atomicidad de las Pruebas: Un Test, una Responsabilidad**

*   **La Buena Práctica:** Cada test (`it` o `test`) debe validar una única cosa y ser completamente independiente de los demás.

*   **El Problema Identificado:** El test original `Logout desde diferentes páginas...` era monolítico. Probaba el logout desde `/store`, `/my-orders` y `/admin/products` dentro del mismo bloque, con setups repetidos. Si el primer caso fallaba, los otros no se ejecutaban.

*   **La Solución en Cypress y Playwright: Hooks y Contextos/Descripciones**
    *   **Implementación:** Se reestructuró el archivo de pruebas usando `context()` (Cypress) y `test.describe()` (Playwright) para agrupar tests relacionados. Cada escenario de logout (desde `/store`, desde `/my-orders`, etc.) se convirtió en su propio test `it()`/`test()`. Se utilizó el hook `beforeEach` para realizar el setup común (login y visita a la página), garantizando un estado limpio para cada test.
    *   **¿Por qué esta solución?** Esto asegura que todos los escenarios se validen siempre. Si un test falla, el informe indica exactamente qué funcionalidad está rota, y los demás tests continúan su ejecución. Permite ejecutar un único test de forma aislada para depurar más fácilmente.
    *   **Referencia en la Documentación:**
        *   [**Cypress Best Practices: Relying On The State Of Previous Tests**](https://docs.cypress.io/guides/references/best-practices#Having-Tests-Rely-On-The-State-Of-Previous-Tests)
        *   [**Playwright Docs: Make tests as isolated as possible**](https://playwright.dev/docs/best-practices#make-tests-as-isolated-as-possible)