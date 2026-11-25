// @ts-check
const { CoreAdminBasePage } = require('./CoreAdminBasePage');

/**
 * Charge & Rate Config → Discount Rates
 * (`/transpay-discount-configuration/discount-configuration/create`).
 * Confirmed live (2026-11-25): 6 discount campaigns (Eid al-Adha,
 * Eid Ul Adha Campaign 2024, Top Up Fest, Test Discount, VictoryDay,
 * "xd"), each row's "Edit/ View" (note the space before "View" — a
 * real quirk of this page's button label) opens a separate, dedicated
 * detail page rather than a dialog (see `DiscountRateDetailPage`). All
 * 6 show Status "Active" even when their own date window has already
 * passed — that flag is independent of the From/To dates.
 */
class DiscountRatesPage extends CoreAdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): plain text, not a real heading —
    // and it also appears as the sidebar link text, so .first() is used.
    this.heading = page.getByText('Discount Rates', { exact: true }).first();
    this.filterInput = page.getByPlaceholder('Filter');
    this.addButton = page.getByRole('button', { name: 'Add', exact: true });
  }

  /**
   * Filters the table and waits for it to actually narrow down before
   * returning — same async-re-render gotcha as
   * `MerchantChargeMappingPage.filter()`.
   * @param {string} query
   */
  async filter(query) {
    await this.filterInput.fill(query);
    await this.page.getByRole('row', { name: new RegExp(query) }).first().waitFor();
  }

  /** Opens the detail page for the row currently shown by `filter()`. */
  async clickEditView() {
    await this.page.getByRole('button', { name: 'Edit/ View' }).click();
  }
}

module.exports = { DiscountRatesPage };
