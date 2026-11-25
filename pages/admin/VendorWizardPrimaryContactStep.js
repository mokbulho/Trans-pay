// @ts-check
const { VendorWizardBasePage } = require('./VendorWizardBasePage');

/**
 * Step 3 of 4 — "Primary Contact": the person to contact about this
 * vendor. Confirmed live against merchant-dev (2026-11-25): Full Name,
 * Designation, Email Address and Mobile Number are required;
 * Alternative Mobile Number is optional. All five are plain labeled
 * text/email/tel inputs — no cascading dropdowns or uploads on this
 * step.
 */
class VendorWizardPrimaryContactStep extends VendorWizardBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.fullNameInput = page.getByLabel('Full Name', { exact: true });
    this.designationInput = page.getByLabel('Designation', { exact: true });
    this.emailInput = page.getByLabel('Email Address', { exact: true });
    this.mobileNumberInput = page.getByLabel('Mobile Number', { exact: true });
    this.alternativeMobileNumberInput = page.getByLabel('Alternative Mobile Number', { exact: true });
  }

  /**
   * @param {{
   *   fullName: string,
   *   designation: string,
   *   email: string,
   *   mobileNumber: string,
   *   alternativeMobileNumber?: string,
   * }} details
   */
  async fillPrimaryContact(details) {
    await this.fullNameInput.fill(details.fullName);
    await this.designationInput.fill(details.designation);
    await this.emailInput.fill(details.email);
    await this.mobileNumberInput.fill(details.mobileNumber);
    if (details.alternativeMobileNumber) {
      await this.alternativeMobileNumberInput.fill(details.alternativeMobileNumber);
    }
  }
}

module.exports = { VendorWizardPrimaryContactStep };
