// @ts-check
const { MerchantBasePage } = require('./MerchantBasePage');

/**
 * Step 1 of 8 — "Tell us about your business": pick the legal structure
 * of the organization. Confirmed live: each option is a plain `<button>`
 * (not a radio input) inside the "Merchant Type" field group.
 */
class MerchantTypePage extends MerchantBasePage {
  static OPTIONS = ['Default', 'Education', 'Proprietorship', 'Partnership', 'Limited Company', 'Government'];

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, MerchantBasePage.STEP_LABELS[0]);
    this.merchantTypeButtons = page.getByRole('button', { name: new RegExp(MerchantTypePage.OPTIONS.join('|')) });
  }

  /** @param {string} typeLabel One of MerchantTypePage.OPTIONS, e.g. "Proprietorship". */
  async selectMerchantType(typeLabel) {
    await this.page.getByRole('button', { name: typeLabel, exact: true }).click();
  }
}

module.exports = { MerchantTypePage };
