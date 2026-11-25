// @ts-check
const { CoreAdminBasePage } = require('./CoreAdminBasePage');

/**
 * Charge & Rate Config → Merchant Charge Mapping
 * (`/charge-config/merchant-mapping`). Confirmed live (2026-11-25): the
 * per-merchant Transpay-charge / Other-Charge setup, 18 records (of the
 * platform's 34 merchants — the rest have none configured). The Filter
 * box filters the table client-side as soon as it's typed into, no
 * Search button needed (unlike `CoreMerchantListPage`). Three
 * Configuration Types beyond the simple "Flat X%" / "Flat Y BDT" exist:
 * "X% per band" (tiered by bill size) and "X% or Y BDT — lower wins";
 * one merchant (pinacall) uses Charge Type CONVENIENCE_CHARGE instead
 * of the usual TRANSPAY_CHARGE.
 */
class MerchantChargeMappingPage extends CoreAdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): plain text, not a real heading —
    // and it also appears as the sidebar link text, so .first() is used.
    this.heading = page.getByText('Merchant Charge Mapping', { exact: true }).first();
    this.filterInput = page.getByPlaceholder('Filter');
    this.addButton = page.getByRole('button', { name: 'Add +' });
  }

  /**
   * Filters the table and waits for it to actually narrow down to the
   * matching row(s) before returning — the table re-renders
   * asynchronously, so a bare `fill()` without this wait leaves every
   * row from before the filter still on screen for a moment.
   * @param {string} query
   */
  async filter(query) {
    await this.filterInput.fill(query);
    await this.getRow(query).first().waitFor();
  }

  /** @param {string} merchantUserIdOrName */
  getRow(merchantUserIdOrName) {
    return this.page.getByRole('row', { name: new RegExp(merchantUserIdOrName) });
  }

  /**
   * Opens the Edit dialog for a specific row — scoped to that row's own
   * "Edit" button, since every other row on the (unfiltered) page also
   * has one with the exact same accessible name.
   * @param {string} merchantUserIdOrName
   */
  async clickEdit(merchantUserIdOrName) {
    await this.getRow(merchantUserIdOrName).getByRole('button', { name: 'Edit', exact: true }).click();
  }
}

module.exports = { MerchantChargeMappingPage };
