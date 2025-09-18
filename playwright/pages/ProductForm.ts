// pages/ProductForm.ts
import { Page, Locator, expect } from '@playwright/test';

export class ProductForm {
  readonly page: Page;
  readonly brandSelect: Locator;
  readonly classSelect: Locator;
  readonly fileInput: Locator;
  readonly priceInput: Locator;
  readonly stockInput: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly addButton: Locator;
  readonly updateButton: Locator;
  readonly previewImage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandSelect = page.locator('select[name="productBrand"]');
    this.classSelect = page.locator('select[name="productClass"]');
    this.fileInput = page.locator('input[type="file"]');
    this.priceInput = page.getByTestId('precio-input');
    this.stockInput = page.getByTestId('stock-input');
    this.nameInput = page.getByTestId('nombre-input');
    this.descriptionInput = page.getByTestId('descripcionprod');
    this.addButton = page.getByTestId('add-button');
    this.updateButton = page.getByTestId('update-button');
    this.previewImage = page.getByTestId('vista-previa');
    this.successMessage = page.getByText(/Producto (agregado|actualizado) correctamente/);
  }

  async fillForm({
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
    if (nombre) await this.nameInput.fill(nombre);
    if (descripcion) await this.descriptionInput.fill(descripcion);
    if (precio) await this.priceInput.fill(precio);
    if (stock) await this.stockInput.fill(stock);
    if (brand) await this.brandSelect.selectOption({ label: brand });
    if (productClass) await this.classSelect.selectOption({ label: productClass });
    if (filePath) await this.fileInput.setInputFiles(filePath);
  }

  async expectPreviewVisible() {
    await expect(this.previewImage).toBeVisible();
  }

  async submitNewAndExpectSuccess() {
    await this.addButton.click();
    await expect(this.successMessage).toBeVisible();
  }

  async submitUpdateAndExpectSuccess() {
    await this.updateButton.click();
    await expect(this.successMessage).toBeVisible();
  }
}