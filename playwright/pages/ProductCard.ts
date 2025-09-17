import { Page, Locator, expect } from '@playwright/test';

export class ProductCard {
  readonly page: Page;
  readonly root: Locator;

  constructor(page: Page, productName: string) {
    this.page = page;
    this.root = page.locator('div.card', { hasText: productName });
  }

  async expectVisible() {
    await expect(this.root).toBeVisible();
  }

  async expectPrice(price: string | RegExp) {
    await expect(this.root).toContainText(price);
  }

  async clickEdit() {
    await this.root.getByTestId('edit-button').click();
  }

  async clickDelete() {
    await this.root.getByTestId('delete-button').click();
  }
}