const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-testid="OrderOverviewPanel"] [data-testid="checkout-button"]');
    this.placeOrderButton = page.getByTestId('checkout-button');
    this.confirmationText = page.locator('[data-testid="ConfirmationText"]');
    this.orderNumber = page.locator('[data-testid="OrderNumber"]');
    this.confirmedItemNumber = page.locator('[data-testid="ItemFinal"] [data-testid="ItemNumber"]').first();
    this.confirmedItemQuantity = page.locator('[data-testid="item-quantity"]');
  }

  async goToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyOrderConfirmation() {
    await expect(this.confirmationText).toBeVisible();
    await expect(this.orderNumber).toBeVisible();
  }

  async verifyConfirmedProduct(expectedProductNumber, expectedQuantity) {
    await expect(this.confirmedItemNumber).toHaveText(expectedProductNumber);
    await expect(this.confirmedItemQuantity).toHaveText(String(expectedQuantity));
  }
}

module.exports = { CheckoutPage };