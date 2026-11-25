// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Transpay Discount Campaign Configuration Detail" page
 * (`/transpay-discount-configuration/discount-configuration-details-view/:id`),
 * opened from `DiscountRatesPage.clickEditView()`. Confirmed live
 * (2026-11-25): Discount Name, Discount Type, Discount Amount, Min
 * Amount, Limit Amount, From Date, To Date and Status are all read-only
 * textboxes whose accessible name IS their current value (not a stable
 * label), so they're targeted by DOM position here, not by name. An
 * explicit Activate/Deactivate pair of buttons is the only way to
 * change Status from this page.
 */
class DiscountRateDetailPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Transpay Discount Campaign Configuration Detail' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.discountNameInput = page.locator('label:has-text("Discount Name") + input');
    this.discountTypeInput = page.locator('label:has-text("Discount Type") + input');
    this.discountAmountInput = page.locator('label:has-text("Discount Amount") + input');
    this.minAmountInput = page.locator('label:has-text("Min Amount") + input');
    this.limitAmountInput = page.locator('label:has-text("Limit Amount") + input');
    this.fromDateInput = page.locator('label:has-text("From Date") + input');
    this.toDateInput = page.locator('label:has-text("To Date") + input');
    this.statusInput = page.locator('label:has-text("Status") + input');
    this.activateButton = page.getByRole('button', { name: 'Activate' });
    this.deactivateButton = page.getByRole('button', { name: 'Deactivate' });
  }
}

module.exports = { DiscountRateDetailPage };
