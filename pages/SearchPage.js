class SearchPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('[data-testid="header-search-input"]');
    this.firstProduct = page.locator('[data-testid="part-number-suggestion"]').first();
    this.firstProductNumber = page.locator('[data-testid="item-suggestion-id"]').first();
  }

  async search(query) {
    await this.searchInput.fill(query);
  }

  async getFirstProductNumber() {
    return await this.firstProductNumber.innerText();
  }

  async selectFirstProduct() {
    await this.firstProduct.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { SearchPage };