// @ts-check
const { CoreAdminBasePage } = require('./CoreAdminBasePage');

/**
 * Merchant Integration → Merchant Type (`/view-merchant/merchant-type`).
 * Confirmed live (2026-11-25): a flat, read-only-by-default list of the
 * platform's merchant categories (Education, Default, Proprietorship,
 * Partnership, Limited Company, Government, Mobile Recharge, NGO — 8
 * records), each with its own "Edit" and a method-type code (e.g.
 * EDU001). "NGO" is the only one seen Inactive; every other type is
 * Active.
 */
class MerchantTypePage extends CoreAdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): this page's title is plain text,
    // not a real heading element — same discrepancy as the sidebar
    // groups in CoreAdminBasePage.js.
    this.heading = page.getByText('Merchant Type', { exact: true }).first();
    this.filterInput = page.getByPlaceholder('Filter');
    this.addMerchantTypeButton = page.getByRole('button', { name: 'Add Merchant Type' });
  }

  /**
   * @param {string} merchantTypeName e.g. "Education". Not anchored to
   * the start of the row's accessible name — confirmed live each row
   * reads "Edit <Type> <Code> <Active|Inactive>", i.e. the row's own
   * "Edit" button's text comes first.
   */
  getRow(merchantTypeName) {
    return this.page.getByRole('row', { name: new RegExp(merchantTypeName) });
  }
}

module.exports = { MerchantTypePage };
