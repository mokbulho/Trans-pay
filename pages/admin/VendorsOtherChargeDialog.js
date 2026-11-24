// @ts-check

/**
 * "Vendors · {merchant}" dialog, opened from a merchant row's "Vendors &
 * Other Charge" menu item. Confirmed live (2026-11-24): lists any vendor
 * attached to the merchant, and who is actually paid the merchant's
 * Other Charge — the V entity from TP_Charge_Distribution_Scenarios.xlsx.
 *
 * Three real states observed:
 *  - No super merchant, no vendor attached → "Who is paid the Other
 *    Charge" is editable (merchant itself / a vendor).
 *  - A super merchant is attached → the setting is locked with
 *    "This merchant trades under a super merchant, which takes its
 *    Other Charge. The setting below waits until it is detached."
 */
class VendorsOtherChargeDialog {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Dialog's accessible name is dynamic: "Vendors · {merchantName}".
    this.dialog = page.getByRole('dialog', { name: /^Vendors ·/ });
    this.noVendorAttachedMessage = this.dialog.getByText('No vendor is attached.', { exact: false });
    this.locksByHierarchyMessage = this.dialog.getByText(
      'This merchant trades under a super merchant, which takes its Other Charge.',
      { exact: false }
    );
    this.merchantKeepsItRadio = this.dialog.getByRole('radio', { name: /^The merchant keeps it/ });
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' }).last();
  }

  async close() {
    await this.closeButton.click();
  }
}

module.exports = { VendorsOtherChargeDialog };
