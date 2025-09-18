# Prueba de Concepto (PoC): Cypress vs. Playwright para Testing E2E

## 1. Objetivo del Proyecto

Este repositorio contiene la implementación práctica de una Prueba de Concepto (PoC) diseñada para comparar dos de las herramientas más populares de testing End-to-End (E2E): **Cypress** y **Playwright**.

El objetivo principal fue construir un conjunto de pruebas idéntico en ambos frameworks, aplicándolo sobre una aplicación web real de e-commerce. A través de esta implementación, se evaluaron aspectos críticos como la experiencia del desarrollador (DX), la velocidad de ejecución, la robustez de las pruebas, las capacidades de depuración y la mantenibilidad del código a largo plazo.

El resultado de esta PoC es un [informe técnico detallado](https://docs.google.com/document/d/1Ta0GKn7DjTFEG155zJZZQ8PwN_CjA8QxgXqSnYfO88I/edit?tab=t.0#heading=h.eld10njg5qju) y este repositorio, que sirve como un artefacto práctico y un ejemplo de código para equipos que buscan decidir qué herramienta se adapta mejor a sus necesidades.

## 2. La Aplicación Bajo Prueba

Para asegurar un escenario realista, las pruebas se ejecutaron sobre un proyecto funcional de e-commerce llamado **"Don Julio Café"**. Esta aplicación cuenta con un frontend desarrollado en React y un backend en Node.js, incluyendo funcionalidades como:
*   Autenticación de usuarios (clientes y administradores).
*   Catálogo de productos con filtros y búsqueda.
*   Panel de administración para el CRUD (Crear, Leer, Actualizar, Eliminar) de productos.
*   Flujo de cierre de sesión y gestión de rutas protegidas.

## 3. Descripción de los Tests Implementados

Se diseñó una suite de pruebas que simula un flujo de usuario completo desde la perspectiva de un administrador, cubriendo las interacciones más críticas de la aplicación. Para mantener una comparación justa, cada escenario fue implementado de manera equivalente en Cypress y Playwright, aplicando las mejores prácticas recomendadas por cada herramienta.

Los flujos principales incluyen:
*   **Login y Navegación:** Se valida tanto el inicio de sesión exitoso como el fallido, y se confirma que la sesión del usuario persiste al navegar entre diferentes secciones del sitio.
*   **CRUD de Productos:** Un flujo completo que prueba la creación, edición y eliminación de un artículo desde el panel de administración.
*   **Validaciones y Logout:** Se ponen a prueba los filtros de la tienda (búsqueda por texto, orden por precio, slider) y se validan múltiples escenarios de cierre de sesión para asegurar que el estado de la aplicación se limpie correctamente.

## 4. Guías y Documentación Interna

Para un análisis más profundo sobre la configuración, estrategia y hallazgos, puedes consultar los siguientes documentos:

*   **[📄 Descripción General de la Estrategia de Testing](./entregables_internos/TESTING_OVERVIEW.md):** Detalla la filosofía y las decisiones de arquitectura detrás de la implementación de los tests.
*   **[⚙️ Entorno de Pruebas y Dataset](./entregables_internos/ENTORNO-PRUEBAS.md):** Describe la configuración del entorno, la base de datos de prueba y el script de *seeding*.
*   **[🔬 Análisis de Fallas y Refactorización](./entregables_internos/ANALISIS-FALLAS.md):** Documenta los errores encontrados durante las pruebas y las soluciones aplicadas.
*   **[📑 Justificación de la Refactorización del Logout](./entregables_internos/REFACTORIZACION-LOGOUT.md):** Explica en detalle las mejoras aplicadas a los tests de cierre de sesión.
*   **[📘 Guía de Inicio Rápido - Cypress](./entregables_internos/README-CYPRESS.md):** Instrucciones para instalar y ejecutar los tests de Cypress.
*   **[📗 Guía de Inicio Rápido - Playwright](./entregables_internos/README-PLAYWRIGHT.md):** Instrucciones para instalar y ejecutar los tests de Playwright.

## 5. Agradecimientos

Queremos extender un agradecimiento especial a los desarrolladores originales del proyecto "Don Julio Café", cuyo trabajo nos proporcionó una base sólida y realista para llevar a cabo esta Prueba de Concepto. Su aplicación nos permitió realizar pruebas significativas y complejas.

<table>
  <thead>
    <tr>
      <th align="center">Avatar</th>
      <th>Nombre Completo</th>
      <th align="center">Perfil de GitHub</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <img src="https://github.com/MaNNu017.png" alt="Avatar de Manuel Coccoz" width="80">
      </td>
      <td valign="middle">Manuel Coccoz</td>
      <td align="center" valign="middle">
        <a href="https://github.com/MaNNu017">
          <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=for-the-badge&logo=github" alt="Perfil de GitHub">
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="middle">
        <img src="https://github.com/guidoRodriguez13.png" alt="Avatar de Guido Rodriguez" width="80">
      </td>
      <td valign="middle">Guido Rodriguez</td>
      <td align="center" valign="middle">
        <a href="https://github.com/guidoRodriguez13">
          <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=for-the-badge&logo=github" alt="Perfil de GitHub">
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="middle">
        <img src="https://github.com/JuanBona.png" alt="Avatar de Juan Cruz Bonanno" width="80">
      </td>
      <td valign="middle">Juan Cruz Bonanno</td>
      <td align="center" valign="middle">
        <a href="https://github.com/JuanBona">
          <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=for-the-badge&logo=github" alt="Perfil de GitHub">
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="middle">
        <img src="https://github.com/felifernandez07.png" alt="Avatar de Felipe Fernandez" width="80">
      </td>
      <td valign="middle">Felipe Fernandez</td>
      <td align="center" valign="middle">
        <a href="https://github.com/felifernandez07">
          <img src="https://img.shields.io/badge/GitHub-Profile-blue?style=for-the-badge&logo=github" alt="Perfil de GitHub">
        </a>
      </td>
    </tr>
  </tbody>
</table>

## 6. Documentación Completa

El análisis exhaustivo, las métricas de rendimiento, las conclusiones y la recomendación final se encuentran en nuestro informe técnico.

➡️ **[Accede a toda la documentación y el informe final en Google Drive](https://drive.google.com/drive/u/0/folders/1U2MHWTdCO-14WlQMnh8lOvM7UlSrWKXD)**