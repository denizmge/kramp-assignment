const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.locator('[data-testid="BuyBlock"] [data-testid="AddToQuotationButton"]');
    this.shoppingCartButton = page.locator('[data-testid="ShoppingCartButton"]');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async verifyAddedToCart() {
    await expect(this.addToCartButton).toContainText('in');
  }

  async goToCart() {
    await this.shoppingCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { CartPage };