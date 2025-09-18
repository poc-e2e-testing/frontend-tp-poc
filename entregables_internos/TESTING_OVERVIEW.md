# Descripción General de la Estrategia de Testing <small>[⬅️ Volver al README Principal](../README.md)</small>

Este documento detalla la filosofía y las decisiones de arquitectura detrás de la implementación de los tests E2E para la Prueba de Concepto de Cypress vs. Playwright. El objetivo fue crear una suite de pruebas mantenible, robusta y que siguiera las mejores prácticas de cada herramienta.

## Principios Comunes Aplicados

Para asegurar una comparación justa, ambos conjuntos de pruebas se construyeron sobre los siguientes principios:

1.  **Page Object Model (POM):** Toda la interacción con la UI se abstrajo en clases de página (`LoginForm`, `Navbar`, `StorePage`, etc.). Esto desacopla la lógica de los tests de los selectores del DOM, haciendo que las pruebas sean más legibles y mucho más fáciles de mantener. Si un `id` o una `clase` cambia en el frontend, solo se necesita actualizarlo en un único archivo (el POM) en lugar de en múltiples archivos de prueba.

2.  **Aislamiento de Tests:** Cada test (`it` en Cypress, `test` en Playwright) fue diseñado para ser atómico e independiente. Se utilizaron hooks como `beforeEach` para asegurar que cada prueba comenzara desde un estado limpio y conocido, evitando que el resultado de una prueba afectara a la siguiente.

3.  **Datos de Prueba Externos (Fixtures):** Las credenciales de usuario y los datos de productos se almacenaron en archivos `.json` en la carpeta `fixtures`. Esto separa los datos de la lógica de la prueba, permitiendo reutilizarlos y modificarlos fácilmente sin alterar el código del test.

## Estrategia Específica por Herramienta

Aunque los flujos de usuario probados son idénticos, la implementación refleja las fortalezas y la filosofía de cada framework.

### Estrategia en Cypress

La implementación en Cypress se centró en aprovechar al máximo su **excelente experiencia de desarrollador (DX)** y su Test Runner interactivo.

- **Gestión de Sesión con `cy.session()`:** Para evitar iniciar sesión a través de la UI en cada prueba (lo cual es lento y frágil), se creó un **comando personalizado** `cy.loginByApi()`. Este comando realiza una petición `POST` directamente al backend para autenticarse. Crucialmente, esta lógica está envuelta en `cy.session()`, una función que cachea el estado del navegador (localStorage, cookies) después del primer login. En las pruebas siguientes, la sesión se restaura instantáneamente desde la caché, haciendo que la preparación de los tests sea extremadamente rápida.

- **Sintaxis Declarativa y Encadenable:** Se favoreció la sintaxis fluida de Cypress (`cy.get(...).click().should(...)`). Las aserciones (`.should()`) se encadenan directamente a las acciones, lo que hace que el flujo de la prueba sea muy fácil de leer como si fuera una oración.

- **Sincronización con la Red:** Para tests que dependen de respuestas de la API (como los filtros de la tienda), se utilizó `cy.intercept()` para espiar las llamadas de red. Al usar `cy.wait('@aliasDeLaRuta')`, la prueba se detiene de forma inteligente y espera a que el servidor responda antes de continuar con las validaciones, eliminando la necesidad de esperas de tiempo fijo (`cy.wait(500)`) y creando tests más robustos.

### Estrategia en Playwright

La implementación en Playwright se diseñó para sacar partido de su **potente arquitectura** y sus capacidades avanzadas de automatización.

- **Gestión de Sesión con Proyectos de Setup:** Playwright promueve un aislamiento aún más fuerte a través de su arquitectura de **proyectos de setup**. Se creó un archivo `auth.setup.ts` que se ejecuta una única vez antes de toda la suite de pruebas. Este archivo se loguea vía API y guarda el estado de la sesión autenticada en un archivo (`storageState.json`). El resto de los tests se configuran para usar este archivo, lo que significa que cada prueba se inicia en una instancia de navegador completamente nueva que ya está autenticada. Este es el enfoque más eficiente y robusto para la gestión de sesiones.

- **Sintaxis `async/await` y Localizadores:** Se utilizó la sintaxis moderna de JavaScript `async/await`, que es estándar en el desarrollo web actual. Se priorizó el uso de los **localizadores** de Playwright (`page.getByRole`, `page.getByTestId`), que son resistentes a los cambios en el DOM. Las aserciones se realizan con la función `expect()` separada, un patrón muy familiar para quienes trabajan con frameworks como Jest.

- **Auto-Esperas Inteligentes:** A diferencia de Cypress, donde a veces es beneficioso esperar a las llamadas de red, las **auto-esperas** de Playwright son tan avanzadas que en la mayoría de los casos no es necesario interceptar la red. Playwright espera automáticamente a que los elementos sean "accionables" (visibles, habilitados, etc.) y a que las actualizaciones del DOM se estabilicen después de una acción, lo que simplifica el código de la prueba.
