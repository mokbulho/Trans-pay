// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * Merchant pricing page (`/admin/merchants/:id/pricing`), reached from an
 * Approved-tab row's "Pricing" link. Confirmed live against merchant-dev
 * (2026-11-24): 4 sections — What it is charged, Payment instruments,
 * Merchant wise rate, Hierarchy. This page object only covers enough to
 * confirm the "second phase" navigation lands correctly; the instrument/
 * rate/hierarchy editing inside it is a large separate feature area and
 * is intentionally out of scope here (see README).
 */
class MerchantPricingPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.paymentInstrumentsHeading = page.getByRole('heading', { name: 'Payment instruments' });
    this.merchantWiseRateHeading = page.getByRole('heading', { name: 'Merchant wise rate' });
    this.hierarchyHeading = page.getByRole('heading', { name: 'Hierarchy', exact: true });
  }

  /** @param {string} merchantName */
  heading(merchantName) {
    return this.page.getByRole('heading', { name: merchantName, exact: true });
  }
}

module.exports = { MerchantPricingPage };
