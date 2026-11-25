// @ts-check
const { CoreAdminBasePage } = require('./CoreAdminBasePage');

/**
 * EMI Setting → EMI Activation (`/transpay-emi/emi-activation`),
 * titled "Activate EMI for Merchant" on the page itself. Confirmed live
 * (2026-11-25): only **one** merchant has EMI activated at all —
 * m134 (transpaycoretest, the platform's own internal test account) —
 * across all 5 supported banks. No real/customer merchant (Aalo,
 * Rahim General Store, the colleges, ...) has EMI activated.
 */
class EmiActivationPage extends CoreAdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): plain text, not a real heading.
    this.heading = page.getByText('Activate EMI for Merchant', { exact: true });
    this.searchInput = page.getByPlaceholder('Search', { exact: true });
    this.addAssignEmiButton = page.getByRole('button', { name: 'Add Assign EMI to Merchant' });
  }

  /** @param {string} transpayId e.g. "m134" */
  getRow(transpayId) {
    return this.page.getByRole('row', { name: new RegExp(transpayId) });
  }
}

module.exports = { EmiActivationPage };
