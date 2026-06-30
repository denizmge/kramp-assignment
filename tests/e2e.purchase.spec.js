const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { SearchPage } = require('../pages/SearchPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const testData = require('../testData');

test('User completes purchase journey: search to order confirmation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  let selectedProductNumber;

  await test.step('Login', async () => {
    await loginPage.goto();
    await loginPage.login(testData.username, testData.password);
    await expect(page).toHaveURL(/\/shop-nl/);
  });

  await test.step('Search for a product', async () => {
    await searchPage.search(testData.searchTerm);
    selectedProductNumber = await searchPage.getFirstProductNumber();
    await searchPage.selectFirstProduct();
    await expect(page).toHaveURL(/\/p\//);
  });

  await test.step('Add product to cart', async () => {
    await cartPage.addToCart();
    await cartPage.verifyAddedToCart();
  });

  await test.step('Go to cart', async () => {
    await cartPage.goToCart();
    await expect(page).toHaveURL(/\/shopping-cart/);
  });

  await test.step('Go to checkout', async () => {
    await checkoutPage.goToCheckout();
    await expect(page).toHaveURL(/\/checkout/);
  });

  await test.step('Place order and verify confirmation', async () => {
    await checkoutPage.placeOrder();
    await expect(page).toHaveURL(/\/confirmation/);
    await checkoutPage.verifyOrderConfirmation();
    await checkoutPage.verifyConfirmedProduct(selectedProductNumber, testData.expectedQuantity);
  });

});