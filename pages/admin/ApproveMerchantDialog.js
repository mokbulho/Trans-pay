// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Approve and provision merchant" dialog. Confirmed live against
 * merchant-dev (2026-11-24): Domain, Allowed IPs (at least one, "Add IP"
 * for more) and Settlement cycle (days) are required and are **not**
 * part of the merchant's own onboarding form — they're admin-only
 * provisioning fields. "Super merchant" is an optional typeahead; leaving
 * it empty approves the merchant as a standalone (super) merchant.
 *
 * Scoped to this dialog's own accessible name throughout, since its
 * submit button is also named "Approve merchant" — identical to the
 * trigger button still open behind it (from ApplicationDetailsDialog or
 * the row's action menu) — which would otherwise be ambiguous.
 */
class ApproveMerchantDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.dialog = page.getByRole('dialog', { name: 'Approve and provision merchant' });
    this.domainInput = this.dialog.getByPlaceholder('https://shop.example.com');
    this.allowedIpInputs = this.dialog.getByPlaceholder('203.0.113.10');
    this.addIpButton = this.dialog.getByRole('button', { name: 'Add IP' });
    this.settlementCycleInput = this.dialog.getByLabel('Settlement cycle (days)', { exact: true });
    this.superMerchantSearchInput = this.dialog.getByPlaceholder('Search by name, merchant code or mobile number');
    this.submitButton = this.dialog.getByRole('button', { name: 'Approve merchant', exact: true });
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' });
  }

  /**
   * @param {{domain: string, allowedIp: string, settlementCycleDays: string | number}} details
   */
  async fillAndSubmit(details) {
    await this.domainInput.fill(details.domain);
    await this.allowedIpInputs.first().fill(details.allowedIp);
    await this.settlementCycleInput.fill(String(details.settlementCycleDays));
    await this.submitButton.click();
  }
}

module.exports = { ApproveMerchantDialog };
