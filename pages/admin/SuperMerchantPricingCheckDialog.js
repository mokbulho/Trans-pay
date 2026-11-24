// @ts-check

/**
 * "Super merchant pricing check" dialog, opened from the Applications
 * list (ApplicationsListPage.superMerchantPricingCheckButton). Confirmed
 * live against merchant-dev (2026-11-24): this is the system's own
 * enforcement of the SM business rule from TP_Charge_Distribution_
 * Scenarios.xlsx — "a sub-merchant must never pay less than its super
 * merchant... or the super merchant's commission on it is negative" —
 * checked across every merchant pair and every payment amount from ৳1.00
 * to ৳1,000,000.00, not just the one merchant you happen to be editing.
 */
class SuperMerchantPricingCheckDialog {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.dialog = page.getByRole('dialog', { name: 'Super merchant pricing check' });
    this.passMessage = this.dialog.getByText(
      'Every sub-merchant pays at least what its super merchant does, on every payment from ৳1.00 to ৳1,000,000.00.'
    );
    this.checkAgainButton = this.dialog.getByRole('button', { name: 'Check again' });
    // Two "Close" buttons exist (an icon one in the header, a text one in
    // the footer) — the footer one is the last in DOM order.
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' }).last();
  }

  async close() {
    await this.closeButton.click();
  }
}

module.exports = { SuperMerchantPricingCheckDialog };
