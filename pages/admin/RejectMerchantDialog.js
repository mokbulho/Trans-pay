// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Reject this merchant?" dialog. Confirmed live against merchant-dev
 * (2026-11-24): a single required "Reason" textarea (max 500 chars,
 * "shown to the applicant as-is"); rejecting sends the application back
 * to draft so the merchant can edit and resubmit.
 */
class RejectMerchantDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.dialog = page.getByRole('dialog', { name: 'Reject this merchant?' });
    this.reasonTextarea = this.dialog.getByPlaceholder('What does the applicant need to fix or provide?');
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
    this.submitButton = this.dialog.getByRole('button', { name: 'Reject application' });
  }

  /** @param {string} reason */
  async reject(reason) {
    await this.reasonTextarea.fill(reason);
    await this.submitButton.click();
  }
}

module.exports = { RejectMerchantDialog };
