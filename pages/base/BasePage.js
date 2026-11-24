// @ts-check

/**
 * Common behaviour shared by every page object in the framework.
 * Feature page objects extend this instead of re-implementing
 * navigation/wait helpers.
 */
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /**
   * @param {string} path Absolute URL or a path relative to playwright.config's baseURL.
   */
  async goto(path = '/') {
    await this.page.goto(path);
  }

  /** @param {string} urlPart */
  async waitForUrlContaining(urlPart) {
    await this.page.waitForURL(`**${urlPart}**`);
  }

  async title() {
    return this.page.title();
  }

  /**
   * Drives the custom "Search and select" dropdown pattern used throughout
   * the merchant onboarding wizard (District, Upazila, Business Starting
   * Year, Bank Name, Branch Name, ...): a trigger button that opens a
   * panel with a "Search..." text box and a filtered list of options.
   * Confirmed live against merchant-dev (2026-11-24).
   * Pass the option's exact visible label (e.g. "DUTCH-BANGLA BANK LTD",
   * not "Dutch") — it is typed into the search box to filter the list and
   * then clicked as an exact text match.
   * @param {import('@playwright/test').Locator} triggerLocator The closed dropdown's button.
   * @param {string} optionText Exact option label to search for and click.
   */
  async selectFromSearchDropdown(triggerLocator, optionText) {
    await triggerLocator.click();
    await this.page.getByPlaceholder('Search...').fill(optionText);
    await this.page.getByText(optionText, { exact: true }).first().click();
  }
}

module.exports = { BasePage };
