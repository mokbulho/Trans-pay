// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Transpay Discount Detail" dialog, opened from
 * `DiscountAssignmentPage.clickEditView()`. Confirmed live (2026-11-25):
 * two sections — "DISCOUNT DETAILS" (Transpay ID, Name, From Time, To
 * Time, User Type, Applicable To, Active Status) and "CAMPAIGN
 * CONFIGURATION DETAILS" (Discount Name, Discount Amount, From Time, To
 * Time, Min Transaction Amount, Discount Type, Max Amount) — all
 * read-only fields. "Applicable To" was seen reading "Bill Amount".
 * Activate/Deactivate is a single button whose label flips with the
 * record's current state (seen as "Inactive" on an Active record, i.e.
 * it shows the action it will perform, not the current status).
 */
class DiscountAssignmentDetailDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Transpay Discount Detail' });
    this.transpayIdInput = page.locator('label:has-text("Transpay ID") + input');
    this.nameInput = page.locator('label:has-text("Name") + input').first();
    this.userTypeInput = page.locator('label:has-text("User Type") + input');
    this.applicableToInput = page.locator('label:has-text("Applicable To") + input');
    this.activeStatusInput = page.locator('label:has-text("Active Status") + input');
    this.discountNameInput = page.locator('label:has-text("Discount Name") + input');
    this.discountAmountInput = page.locator('label:has-text("Discount Amount") + input');
    this.minTransactionAmountInput = page.locator('label:has-text("Min Transaction Amount") + input');
    this.discountTypeInput = page.locator('label:has-text("Discount Type") + input');
    this.maxAmountInput = page.locator('label:has-text("Max Amount") + input');
    this.closeButton = page.getByRole('button', { name: 'Close', exact: true });
    this.toggleStatusButton = page.getByRole('button', { name: /^(Active|Inactive)$/ });
  }

  async close() {
    await this.closeButton.click();
  }
}

module.exports = { DiscountAssignmentDetailDialog };
