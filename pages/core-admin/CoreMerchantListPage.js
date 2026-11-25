// @ts-check
const { CoreAdminBasePage } = require('./CoreAdminBasePage');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Merchant Integration → Merchant List (`/view-merchant`), the core
 * platform's own merchant directory — distinct from merchant-dev's
 * Admin Console "Applications"/"Approved" list, which is a different
 * site entirely. Confirmed live (2026-11-25): 34 merchants, each row's
 * "..." Action button (unlabelled icon-only) opens a flyout menu with 5
 * items: Edit Details, Bank Details, Appearance Settings, Reset API
 * Secret, Assign Instrument.
 *
 * A quirk seen live: clicking "Search" with only the text Filter filled
 * in (the From/To date pickers left empty) sometimes surfaces a
 * "Select both From and To dates." error dialog — harmlessly, the
 * filter still applies underneath it. `search()` dismisses that dialog
 * if it appears rather than treating it as a failure.
 */
class CoreMerchantListPage extends CoreAdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): plain text, not a real heading.
    this.heading = page.getByText('Merchant Integration', { exact: true }).first();
    this.filterInput = page.getByPlaceholder('Filter');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.addMerchantButton = page.getByRole('button', { name: 'Add Merchant' });
    this.searchFailedCloseButton = page.getByRole('button', { name: 'Close', exact: true });
  }

  /** @param {string} query e.g. a merchant user id or company name */
  async search(query) {
    await this.filterInput.fill(query);
    await this.searchButton.click();
    await this.searchFailedCloseButton.click({ timeout: 2_000 }).catch(() => {});
  }

  /** @param {string} companyName e.g. "Aalo" */
  getRow(companyName) {
    return this.page.getByRole('row', { name: new RegExp(escapeRegExp(companyName)) });
  }

  /** Opens a merchant row's "..." action flyout. */
  async openActions(companyName) {
    await this.getRow(companyName).getByRole('button').click();
  }

  actionMenu() {
    return this.page.getByRole('menu');
  }

  async clickEditDetails() {
    await this.actionMenu().getByRole('button', { name: 'Edit Details' }).click();
  }

  async clickBankDetails() {
    await this.actionMenu().getByRole('button', { name: 'Bank Details' }).click();
  }

  async clickAppearanceSettings() {
    await this.actionMenu().getByRole('button', { name: 'Appearance Settings' }).click();
  }

  async clickResetApiSecret() {
    await this.actionMenu().getByRole('button', { name: 'Reset API Secret' }).click();
  }

  async clickAssignInstrument() {
    await this.actionMenu().getByRole('button', { name: 'Assign Instrument' }).click();
  }
}

module.exports = { CoreMerchantListPage };
