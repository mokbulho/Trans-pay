// @ts-check
const { VendorWizardBasePage } = require('./VendorWizardBasePage');

/**
 * Step 4 of 4 — "Bank Details": the vendor's settlement account. The
 * last step — saving it submits the vendor for admin approval (its
 * type=submit button reads "Save & submit for approval", not "Save &
 * continue"). Confirmed live against merchant-dev (2026-11-25), same
 * pattern as the merchant onboarding wizard's BankDetailsPage:
 *  - Bank Name and Branch Name are the custom "Search and select"
 *    dropdown; Branch Name cascades from Bank Name (disabled native
 *    select reading "Choose the previous option first" until a bank is
 *    chosen). Not every branch exists for every bank here — e.g.
 *    DUTCH-BANGLA BANK LTD has no "Badda" branch, only "Banani" and
 *    others.
 *  - Routing Number auto-fills (greyed out) once a branch is chosen
 *    and is not user-editable — treat it as read-only/derived.
 *  - Cheque Image is a required upload.
 */
class VendorWizardBankDetailsStep extends VendorWizardBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

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

  /** The last step's submit button reads "Save & submit for approval". */
  async submitForApproval() {
    await this.goToNextStep();
  }
}

module.exports = { VendorWizardBankDetailsStep };
