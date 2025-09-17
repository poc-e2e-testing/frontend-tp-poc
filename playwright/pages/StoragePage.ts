import { type Page, type Locator, expect } from '@playwright/test';

export class StorePage {
  private readonly page: Page;

  // --- Elementos de Filtro ---
  public readonly searchInput: Locator;
  public readonly searchButton: Locator;
  public readonly sortSelect: Locator;
  public readonly priceSliderHandleMin: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-input');
    this.searchButton = page.getByTestId('search-button');
    this.sortSelect = page.getByTestId('sort-select');
    this.priceSliderHandleMin = page.getByTestId('price-slider').locator('.rc-slider-handle').first();
  }

  // --- Elementos de la Grilla de Productos ---
  getProductCards() {
    return this.page.getByTestId('product-card');
  }

  // --- Acciones de Usuario ---
  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async sortByPrice(direction: 'asc' | 'desc' | '') {
    await this.sortSelect.selectOption(direction);
  }

  // --- Helpers para Aserciones ---
  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.getProductCards().getByTestId('product-price');
    const priceTexts = await priceLocators.allTextContents();
    return priceTexts.map(text => parseFloat(text.replace(/[$.]/g, '').replace(',', '.')));
  }
}