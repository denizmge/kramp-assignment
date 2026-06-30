class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.cookieAcceptButton = page.locator('#onetrust-accept-btn-handler');
    this.languageConfirmButton = page.locator('a:has-text("Doorgaan")');
    this.loginNavButton = page.locator('a[title="Login"]');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');

    await this.page.waitForTimeout(1000); 

    if (await this.cookieAcceptButton.isVisible()) {
      await this.cookieAcceptButton.click();
    }

    if (await this.languageConfirmButton.isVisible()) {
      await this.languageConfirmButton.click();
    }

    await this.loginNavButton.click();
    await this.page.waitForLoadState('networkidle');

    if (await this.cookieAcceptButton.isVisible()) {
      await this.cookieAcceptButton.click();
    }
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/\/shop-nl/);
  }
}

module.exports = { LoginPage };