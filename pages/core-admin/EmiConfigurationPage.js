// @ts-check
const { CoreAdminBasePage } = require('./CoreAdminBasePage');

/**
 * EMI Setting → EMI Configuration (`/transpay-emi/emi-configuration`).
 * Confirmed live (2026-11-25): per-bank EMI eligibility — 5 banks
 * (UCBL, Southeast Bank, Brac Bank, Eastern Bank, AB Bank), all Active,
 * each with a Minimum Amount (৳5,000 for most, ৳10,000 for Brac Bank)
 * and both Other Charges and Processing Fee at 0.
 */
class EmiConfigurationPage extends CoreAdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): plain text, not a real heading.
    this.heading = page.getByText('EMI Configuration Details', { exact: true });
    this.searchInput = page.getByPlaceholder('Search', { exact: true });
    this.addButton = page.getByRole('button', { name: 'Add', exact: true });
  }

  /** @param {string} bankName e.g. "Brac Bank" */
  getRow(bankName) {
    return this.page.getByRole('row', { name: new RegExp(bankName) });
  }
}

module.exports = { EmiConfigurationPage };
