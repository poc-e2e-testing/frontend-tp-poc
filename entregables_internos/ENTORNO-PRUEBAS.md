# Entorno de Pruebas - Backend E-Commerce Café Don Julio <small>[⬅️ Volver al README Principal](../README.md)</small>

## Descripción General

Este documento describe la configuración y uso del entorno de pruebas para el 
el proyecto de e-commerce de café Don Julio. 

---

# FRONTEND

## Infraestructura para TESTS

```
FRONTEND-TP-POC/
├── node_modules/
├── public/
├── src/                      # Código fuente de la aplicación
│   ├── components/
│   ├── ...
│   └── __tests__/            # Generalmente para tests unitarios/integración (Jest, Vitest)
│
# ==============================================================================
# Carpeta principal para todo lo relacionado con el framework de pruebas Cypress
# ==============================================================================
├── cypress/
│
│   # --- Casos de Prueba (Specs) ---
│   ├── e2e/                  # Contiene todos los archivos de pruebas End-to-End (lo más importante).
│   │   ├── specs/            # (Convención) Subcarpeta para organizar pruebas por funcionalidad.
│   │   │   ├── login.cy.js   # Archivo con pruebas específicas para el flujo de "Login".
│   │   │   └── dashboard.cy.js # Archivo con pruebas para la página del "Dashboard".
│   │   └── common/           # (Convención) Para pruebas de flujos o componentes reutilizables.
│   │       └── navigation.cy.js # Prueba la navegación principal (menú, header, footer).
│
│   # --- Datos de Prueba ---
│   ├── fixtures/             # Almacena datos estáticos (mocks) para tus pruebas en formato JSON.
│   │   ├── usuarios.json     # Ejemplo: lista de usuarios para pruebas de login con diferentes roles.
│   │   └── products.json   # Ejemplo: lista de productos para simular una respuesta de API.
│
│   # --- Código de Soporte y Comandos Personalizados ---
│   ├── support/              # Código de ayuda que se ejecuta antes que tus pruebas. Ideal para reutilizar lógica.
│   │   ├── commands.js       # El mejor lugar para crear comandos personalizados (ej. cy.login()).
│   │   └── e2e.js            # Archivo de configuración global que se carga antes de cada test E2E.
│
│   # --- Artefactos de Ejecución (Generados automáticamente) ---
│   ├── downloads/            # Carpeta donde Cypress guarda archivos descargados durante una prueba. (Ignorar en Git)
│   ├── screenshots/          # Guarda capturas de pantalla automáticamente cuando un test falla. (Ignorar en Git)
│   └── videos/               # Graba videos de cada ejecución de pruebas en modo headless (sin UI). (Ignorar en Git)
│
# ==============================================================================
# Carpeta principal para todo lo relacionado con el framework de pruebas Playwright
# ==============================================================================
├── playwright/
│
│   # --- Casos de Prueba (Specs) ---
│   ├── tests/                # Directorio raíz donde Playwright busca los archivos de prueba.
│   │   ├── specs/            # (Convención) Subcarpeta para organizar pruebas por página o flujo.
│   │   │   ├── login.spec.js # Archivo de prueba para la funcionalidad de "Login".
│   │   │   └── dashboard.spec.js # Archivo de prueba para el "Dashboard".
│   │   └── common/           # (Convención) Para pruebas de funcionalidades transversales.
│   │       └── navigation.spec.js # Prueba los elementos de navegación comunes.
│
│   # --- Page Object Model (Opcional pero muy recomendado) ---
│   ├── page-objects/         # (Patrón de diseño) Abstrae las páginas de la UI en clases para reutilizar código.
│   │   ├── LoginPage.js      # Clase que representa la página de Login, sus elementos y acciones.
│   │   └── DashboardPage.js  # Clase que representa la página del Dashboard.
│
│   # --- Artefactos y Reportes (Generados automáticamente) ---
│   ├── test-results/         # Carpeta donde Playwright guarda resultados crudos de las pruebas. (Ignorar en Git)
│   └── playwright-report/    # Contiene el reporte HTML interactivo de los resultados. (Ignorar en Git)
│
│
# ==============================================================================
# Archivos de Configuración en la Raíz
# ==============================================================================
│
├── cypress.config.js         # Archivo de configuración principal para Cypress (URL base, timeouts, etc.).
├── playwright.config.js      # Archivo de configuración principal para Playwright (navegadores, reporters, etc.).
├── package.json              # Gestiona las dependencias y scripts del proyecto (incluyendo los de Cypress y Playwright).
└── .gitignore                # Archivo para excluir carpetas generadas (node_modules, videos, screenshots, etc.).
```

---

# BACKEND

## Dataset de Pruebas

### Script de Seeding

Para poder trabajar con una base de datos estable, en el repositorio del backend se agregó un script de seeding ubicado en `src/shared/db/seeder.ts` que inicializa la base de datos con datos de prueba consistentes y realistas.

#### Datos Generados

El script crea automáticamente:

**ProductBrands (Marcas de Café):**

- **Don Julio Premium**: Café premium de origen único con notas frutales y cuerpo medio
- **Hacienda Del Valle**: Café orgánico cultivado en las montañas con sabor intenso y aromático

**ProductClasses (Categorías de Producto):**

- **Granos**: Café en grano entero para molienda fresca
- **Molido**: Café molido listo para preparar
- **Accesorios**: Accesorios y utensilios para la preparación de café

**ClientClasses (Tipos de Cliente):**

- **Administrador**: Para usuarios con permisos administrativos
- **Cliente Regular**: Para usuarios finales del sistema

**Clients (Usuarios del Sistema):**

- **Administrador**:

  - Email: `admin@donjulio.com`
  - Contraseña: `Admin1234!`
  - Rol: `admin`
  - Datos completos de perfil

- **Cliente de Prueba**:
  - Email: `cliente@donjulio.com`
  - Contraseña: `Cliente1234!`
  - Rol: `client`
  - Datos completos de perfil

**Products (Productos):**

- **Don Julio Premium Granos 500g**: Café premium en grano ($2500, stock: 50)
- **Hacienda Del Valle Molido 250g**: Café orgánico molido ($1800, stock: 75)

### Ejecución del Seeding - Backend

```bash
# Comando directo (recomendado)
pnpm run seed

# O manualmente:
pnpm run build && node dist/shared/db/seeder.js

# Verificar que los datos se crearon correctamente:
pnpm run build && node dist/shared/db/verify.js
```

## Estados de la Base de Datos

### Estado Inicial (Post-Seeding)

- 2 marcas de café configuradas
- 3 categorías de producto definidas
- 2 usuarios de prueba (admin + cliente)
- 2 productos de ejemplo
- Base de datos lista para pruebas completas

### Reinicialización

El script de seeding puede ejecutarse múltiples veces de forma segura, ya que limpia automáticamente los datos existentes antes de crear nuevos registros.

---

### Páginas y Rutas Internas de la Aplicación

Rutas principales de navegación definidas en el archivo src/App.tsx, que componen las distintas secciones del sitio web:

*   */: *Página de Inicio. Es la página principal que da la bienvenida a los usuarios, mostrando un carrusel de imágenes, productos destacados y los valores de la marca.
*   */store: *Tienda. Muestra el catálogo completo de productos. Permite a los usuarios buscar, filtrar por categoría y precio, y añadir productos al carrito.
*   */about: *Página "Nosotros". Proporciona información sobre la historia y los valores de "Don Julio Café". También incluye un mapa con la ubicación física del local y enlaces a redes sociales.
*   */login: *Página de Inicio de Sesión. Formulario para que los usuarios existentes accedan a sus cuentas.
*   */register: *Página de Registro. Formulario para que nuevos usuarios puedan crear una cuenta.
*   */checkout: *Página de Finalizar Compra. Formulario donde el usuario introduce su información de contacto, envío y método de pago para completar un pedido. Es una ruta protegida que requiere inicio de sesión y tener productos en el carrito.
*   */success: *Página de Compra Exitosa. Página a la que se redirige al usuario tras completar un pedido, mostrando un mensaje de agradecimiento y el número de orden.
*   */my-orders: *Mis Órdenes. Página privada donde un usuario autenticado puede ver el historial de sus compras anteriores.
*   */personal: *Mi Perfil. Página privada que muestra la información del perfil del usuario que ha iniciado sesión.
*   */adm-store: *Panel de Administración de la Tienda. Ruta protegida para administradores. Permite ver, editar, eliminar y añadir nuevos productos al catálogo.
*   */manage: *Gestión de Marcas y Clases. Página para administradores donde pueden crear, editar o eliminar las marcas (ej: "Marca Colombia") y clases (ej: "Grano Entero") de los productos.
*   */unauthorized: *Página de Acceso Denegado. Se muestra a los usuarios que intentan acceder a una ruta de administrador sin los permisos necesarios.

### URLs de la API (Endpoints del Backend)

Estas URLs son utilizadas por la aplicación para comunicarse con el servidor y gestionar los datos (productos, usuarios, órdenes, entre otros.). La URL base es configurable y apunta a http://localhost:10000 o http://localhost:3000.

*   */api/auth/login*: Para autenticar a un usuario y obtener un token de acceso.
*   */api/auth/me*: Para obtener la información del perfil del usuario actualmente autenticado.
*   */api/clients*: Para registrar un nuevo cliente en el sistema.
*   */api/client/classes*: Para obtener los diferentes tipos o clases de clientes disponibles durante el registro.
*   */api/products*: Para obtener la lista de productos (con paginación) o para agregar un nuevo producto.
*   */api/products/{id}*: Para actualizar o eliminar un producto específico por su ID.
*   */api/products/featured*: Para obtener una lista de productos destacados.
*   */api/product/brands*: Para obtener, crear, actualizar o eliminar las marcas de los productos.
*   */api/product/classes*: Para obtener, crear, actualizar o eliminar las clases de los productos.
*   */api/product/implementar*: Para obtener las categorías de los productos que se usan en los filtros de la tienda.
*   */api/orders*: Para crear una nueva orden de compra.
*   */api/orders/my-orders*: Para obtener el historial de órdenes del usuario autenticado.
*   */api/send-email*: Para gestionar la suscripción de un usuario al newsletter.

---

# Mutuos Repositorios

### CI/CD (Pendiente)

- Pipeline de integración continua
- Despliegue automatizado
- Tests automatizados en pipeline
- Configuración de entornos (dev/staging/prod)

---

_Documento actualizado: Septiembre 2025_
