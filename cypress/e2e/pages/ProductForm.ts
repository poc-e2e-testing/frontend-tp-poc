/**
 * Page Object Model para el formulario de producto.
 * Permite interactuar y validar los campos y acciones del formulario de productos.
 */
export class ProductForm {
  /**
   * Campo de entrada para el nombre del producto.
   */
  nameInput = () => cy.get('[data-testid="nombre-input"]');

  /**
   * Campo de entrada para la descripción del producto.
   */
  descriptionInput = () => cy.get('[data-testid="descripcionprod"]');

  /**
   * Campo de entrada para el precio del producto.
   */
  priceInput = () => cy.get('[data-testid="precio-input"]');

  /**
   * Campo de entrada para el stock del producto.
   */
  stockInput = () => cy.get('[data-testid="stock-input"]');

  /**
   * Menú desplegable para seleccionar la marca del producto.
   */
  brandSelect = () => cy.get('[data-testid="productBrand-input"]');

  /**
   * Menú desplegable para seleccionar la clase del producto.
   */
  classSelect = () => cy.get('[data-testid="productClass-input"]');

  /**
   * Campo para subir el archivo de imagen del producto.
   */
  fileInput = () => cy.get('input[type="file"]');

  /**
   * Botón para enviar el formulario y agregar un nuevo producto.
   */
  addButton = () => cy.get('[data-testid="add-button"]');

  /**
   * Botón para enviar el formulario y actualizar un producto existente.
   */
  updateButton = () => cy.get('[data-testid="update-button"]');

  /**
   * Contenedor de la imagen de vista previa del producto.
   */
  previewImage = () => cy.get('[data-testid="vista-previa"]');

  /**
   * Mensaje de confirmación que aparece tras una operación exitosa.
   */
  successMessage = () =>
    cy.contains(/Producto (agregado|actualizado) correctamente/);

  /**
   * Completa el formulario de producto con los datos proporcionados.
   * @param {Object} params - Parámetros del formulario.
   * @param {string} [params.nombre] - Nombre del producto.
   * @param {string} [params.descripcion] - Descripción del producto.
   * @param {string} [params.precio] - Precio del producto.
   * @param {string} [params.stock] - Stock del producto.
   * @param {string} [params.brand] - Marca del producto.
   * @param {string} [params.productClass] - Clase del producto.
   * @param {string} [params.filePath] - Ruta del archivo de imagen.
   */
  fillForm({
    nombre,
    descripcion,
    precio,
    stock,
    brand,
    productClass,
    filePath,
  }: {
    nombre?: string;
    descripcion?: string;
    precio?: string;
    stock?: string;
    brand?: string;
    productClass?: string;
    filePath?: string;
  }) {
    if (nombre) this.nameInput().clear().type(nombre);
    if (descripcion) this.descriptionInput().clear().type(descripcion);
    if (precio) this.priceInput().clear().type(precio);
    if (stock) this.stockInput().clear().type(stock);
    if (brand) this.brandSelect().select(brand);
    if (productClass) this.classSelect().select(productClass);
    if (filePath) this.fileInput().selectFile(filePath, { force: true });
  }

  /**
   * Envía el formulario para agregar un nuevo producto y verifica el mensaje de éxito.
   */
  submitAndExpectAddSuccess() {
    this.addButton().click();
    this.successMessage().should('be.visible');
  }

  /**
   * Envía el formulario para actualizar un producto y verifica el mensaje de éxito.
   */
  submitUpdateAndExpectSuccess() {
    this.updateButton().click();
    this.successMessage().should('be.visible');
  }

  /**
   * Verifica que la imagen de vista previa esté visible.
   */
  expectPreviewVisible() {
    this.previewImage().should('be.visible');
  }
}