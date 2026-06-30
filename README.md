# Kramp QA Automation Assignment

## 📌 Overview

This solution automates the core end to end purchase journey on the Kramp demo platform; login, product search, add to cart, checkout, and order confirmation. Built with Playwright using the Page Object Model design pattern.

## 🧰 Tech Stack

- **Playwright** with **JavaScript** the assignment didn't explicitly require TypeScript, and I chose the language I'm most familiar with to focus on test logic and structure within the time constraint.
- **Chromium** only, to keep execution fast within the suggested time limit.

## 🚀 How to Run

```bash
npm install
npx playwright test
```

To run with the browser visible:

```bash
npx playwright test --headed
```

## 📁 Project Structure

```
kramp-assignment/
├── pages/
│   ├── LoginPage.js
│   ├── SearchPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/
│   └── e2e.purchase.spec.js
├── testData.js
├── playwright.config.js
└── README.md
```

## 📌 Approach and Decisions

**Page Object Model.** Each page has its own class (`LoginPage`, `SearchPage`, `CartPage`, `CheckoutPage`) with its own locators and actions. Keeps the test file readable and makes it easier to update if selectors change.

**Single test file, broken into steps.** The purchase journey is one continuous flow rather than independent units, so I kept it as a single test using `test.step()` for each stage; Login, Search, Add to cart, Go to cart, Go to checkout, Place order. 

**`data-testid` as the primary selector strategy.** Used wherever available, since these attributes are explicitly meant for testing and are much more stable than class names or dynamic IDs.

**Generic search term instead of a hardcoded product code.** I initially used a specific product code (`CT50009`), but a single SKU can be discontinued or go out of stock, which would break the test for reasons unrelated to the actual journey. Switched to a generic search term (`'filter'`) stored in `testData.js`.

**Centralized test data.** Login credentials and the search term live in `testData.js` rather than being hardcoded inline, so they only need updating in one place.

**Scoped selectors for duplicate `data-testid` values.** Some `data-testid`s appear more than once on the same page, e.g. `AddToQuotationButton` exists both on the main product "buy block" and in the "frequently bought together" section (disabled there). Relying on `.first()` initially picked up the wrong, disabled element. Scoped this locator using a parent wrapper (`BuyBlock`) to reliably target the correct element.

**Regex URL assertions over `page.url()` + `.toContain()`.** I experimented with the latter as an alternative, but `page.url()` is evaluated synchronously and doesn't benefit from Playwright's automatic retry/waiting — this caused flaky failures right after navigation, before the URL had updated. Reverted to `expect(page).toHaveURL(regex)`, which waits and retries automatically.

**`domcontentloaded` over `networkidle`.** Initially used `networkidle`, but the Kramp demo site continuously fires background requests. This caused consistent 30-second timeouts. Switched to `domcontentloaded`, which only waits for the HTML to load and is sufficient here. This also aligns with current Playwright guidance.

**Cookie consent and language popups handled defensively.** Since each test run starts in a fresh incognito context, these popups can reappear at the start of every run. A short wait was added after `domcontentloaded` to give the cookie popup time to render before checking for it, then handled with `isVisible()` checks before clicking, so the test doesn't fail if a popup happens not to appear in a given run.

**Clicking real UI elements instead of using `href`.** Navigated by clicking actual buttons/links rather than going directly to their `href` values. The point of an E2E test is to verify the journey actually works through the UI, navigating via `href` wouldn't confirm the button itself is functional or enabled.

**Dynamic product verification on the confirmation page.** The assignment requires verifying that the confirmation page shows the correct product number and quantity for the ordered item. Since a generic search term is used, the selected product's number is captured during the search step and stored, then compared against the product number shown on the confirmation page.

## 📌 What I Chose to Automate vs. Not

**Automated:** The full happy-path purchase journey; login, product search, add to cart, navigating to cart, navigating to checkout, placing the order, and verifying the confirmation page shows both a success message and the correct product number and quantity for the ordered item.

**Not automated:**

- The "Login gelukt" success toast; disappears in well under a second, even before the redirect completes, making it unreliable to assert even with extended timeouts. Used the post-login URL as a more stable indicator instead.
- Negative scenarios (invalid login, empty search results, out of stock).
- Edge cases like adding the same product twice or changing quantities.
- The shopping cart counter in the top-right header bar increment was not asserted.The counter briefly flashes 0 before settling on the correct value, making it unreliable to verify without adding artificial waits that could mask real issues.
- Cross-browser testing and visual/styling checks.

These were intentionally scoped out to respect the suggested time limit, but are listed below as natural next steps.

## 🧠 What I Would Improve With More Time

- Refactor to TypeScript.
- Add negative test scenarios (invalid login, no search results).
- Add quantity and pricing validation e.g. totals updating correctly with multiple products or quantity changes.
- Add out of stock/availability and delivery address validation scenarios.
- Add session/authentication scenarios (timeout behavior, cart persistence across reloads).


