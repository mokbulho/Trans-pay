// @ts-check
const { MerchantBasePage } = require('./MerchantBasePage');

/**
 * Step 7 of 8 — "Bank Details": settlement account. Confirmed live
 * against merchant-dev (2026-11-24):
 *  - Bank Name and Branch Name are the custom "Search and select"
 *    dropdown (see BasePage.selectFromSearchDropdown); Branch Name
 *    cascades from Bank Name.
 *  - Routing Number auto-fills (greyed out) once a branch is chosen and
 *    could not be typed into in testing — treat it as read-only/derived,
 *    not a field to fill.
 *  - Cheque Image is a required upload.
 */
class BankDetailsPage extends MerchantBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, MerchantBasePage.STEP_LABELS[6]);

    // Custom dropdown buttons; see BusinessInformationPage.js for why
    // getByLabel doesn't reach them.
    this.bankNameTrigger = page.locator('label:has-text("Bank Name") + button');
    this.branchNameTrigger = page.locator('label:has-text("Branch Name") + button');
    this.accountNameInput = page.getByLabel('Account Name', { exact: true });
    this.accountNumberInput = page.getByLabel('Account Number', { exact: true });
    this.routingNumberInput = page.getByLabel('Routing Number', { exact: true });
    this.chequeImageInput = page.locator('input[type="file"]').first();
  }

  /**
   * @param {{bankName: string, branchName: string, accountName: string, accountNumber: string, chequeImagePath: string}} details
   */
  async fillBankDetails(details) {
    await this.selectFromSearchDropdown(this.bankNameTrigger, details.bankName);
    await this.selectFromSearchDropdown(this.branchNameTrigger, details.branchName);
    await this.accountNameInput.fill(details.accountName);
    await this.accountNumberInput.fill(details.accountNumber);
    // Routing Number is derived from Bank + Branch and is not user-editable.
    await this.chequeImageInput.setInputFiles(details.chequeImagePath);
  }

  async getRoutingNumber() {
    return this.routingNumberInput.inputValue();
  }
}

module.exports = { BankDetailsPage };
