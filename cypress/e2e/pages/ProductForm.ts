export class ProductForm {
  // Selectores
  nameInput = () => cy.get('[data-testid="nombre-input"]');
  descriptionInput = () => cy.get('[data-testid="descripcionprod"]');
  priceInput = () => cy.get('[data-testid="precio-input"]');
  stockInput = () => cy.get('[data-testid="stock-input"]');
  brandSelect = () => cy.get('[data-testid="productBrand-input"]');
  classSelect = () => cy.get('[data-testid="productClass-input"]');
  fileInput = () => cy.get('input[type="file"]');
  addButton = () => cy.get('[data-testid="add-button"]');
  updateButton = () => cy.get('[data-testid="update-button"]');
  previewImage = () => cy.get('[data-testid="vista-previa"]');
  successMessage = () => cy.contains(/Producto (agregado|actualizado) correctamente/);

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

  submitAndExpectAddSuccess() {
    this.addButton().click();
    this.successMessage().should('be.visible');
  }
  submitUpdateAndExpectSuccess() {
    this.updateButton().click();
    this.successMessage().should('be.visible');
  }

  expectPreviewVisible() {
    this.previewImage().should('be.visible');
  }
}