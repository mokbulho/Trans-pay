// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * Rate Catalogue (`/admin/charges`) — the payment platform's global,
 * read-only PI (Payment Instrument) rates, grouped by merchant type and
 * instrument category (CARDS, Mobile Banking, ...). Confirmed live
 * against merchant-dev (2026-11-24): each row shows the instrument, its
 * percentage, whether it is active, who the charge is borne by, any cap,
 * Inbound/Outbound direction, and a validity date range — a per-merchant
 * override lives on that merchant's own Pricing page instead (see
 * MerchantPricingPage.js).
 */
class RateCataloguePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Rate Catalogue' });
    // The "Merchant type" <label> has no `for`, so getByLabel() can't find
    // its <select> — target it structurally instead (confirmed live).
    this.merchantTypeSelect = page
      .locator('label', { hasText: 'Merchant type' })
      .locator('xpath=following-sibling::div[1]//select');
    this.openMerchantPricingCombobox = page.getByPlaceholder("Open a merchant's pricing...");
  }

  async open() {
    await this.goto('/admin/charges');
  }
}

module.exports = { RateCataloguePage };
