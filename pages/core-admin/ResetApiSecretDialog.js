// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Confirm" dialog, opened from `CoreMerchantListPage`'s row action menu
 * → Reset API Secret. Confirmed live (2026-11-25) — its own copy is an
 * explicit, irreversible-action warning:
 * "This resets the merchant's API secret, not the panel login. The new
 * secret is shown ONCE and cannot be retrieved afterwards. Any
 * integration still using the old secret stops working immediately.
 * Continue?"
 *
 * This suite only ever opens this dialog to confirm its warning copy is
 * still shown, and always clicks **No** — confirming a real reset here
 * would break whatever test-merchant profile is currently using that
 * merchant's secret (see `tests/payment/makePayment.spec.js`'s active
 * profile convention). Never click `confirmButton` in an automated run.
 */
class ResetApiSecretDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Confirm', exact: true });
    this.warningText = page.getByText('The new secret is shown ONCE and cannot be retrieved afterwards');
    this.confirmButton = page.getByRole('button', { name: 'Yes', exact: true });
    this.declineButton = page.getByRole('button', { name: 'No', exact: true });
  }

  async decline() {
    await this.declineButton.click();
  }
}

module.exports = { ResetApiSecretDialog };
