// @ts-check
const { CoreAdminBasePage } = require('./CoreAdminBasePage');

/**
 * Charge & Rate Config → Discount Assignment
 * (`/transpay-discount-configuration/discount-details/create`).
 * Confirmed live (2026-11-25): 5 records linking a Discount Rate to a
 * Transpay ID and an active window, every one scoped User Type
 * "ALLMERCHANT" (none target a single merchant individually). Only one
 * of the 5 is Active at a time in practice. Unlike `DiscountRatesPage`,
 * "Edit/ View" here opens a dialog (`DiscountAssignmentDetailDialog`),
 * not a separate page. This page's own filter box is a "Search..."
 * placeholder, not "Filter" like the sibling pages.
 */
class DiscountAssignmentPage extends CoreAdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): plain text, not a real heading —
    // and it also appears as the sidebar link text, so .first() is used.
    this.heading = page.getByText('Discount Assignment', { exact: true }).first();
    this.searchInput = page.getByPlaceholder('Search...');
    this.addButton = page.getByRole('button', { name: 'Add', exact: true });
  }

  /** @param {string} query */
  async search(query) {
    await this.searchInput.fill(query);
  }

  /** Opens the detail dialog for the row currently shown by `search()`. */
  async clickEditView() {
    await this.page.getByRole('button', { name: 'Edit/ View' }).click();
  }
}

module.exports = { DiscountAssignmentPage };
