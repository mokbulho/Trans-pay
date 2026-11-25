// @ts-check
const { VendorWizardBasePage } = require('./VendorWizardBasePage');

/**
 * Step 1 of 4 — "Personal Information": the vendor's account holder.
 * Confirmed live against merchant-dev (2026-11-25):
 *  - Full Name, Email Address and Mobile Number are always visible;
 *    Mobile Number is hinted "Unique to this vendor" — reusing one
 *    already on file fails (not yet confirmed what the error looks
 *    like; generate a fresh number per run, see utils/dataGenerator).
 *  - NID Number and Date of Birth only render after choosing
 *    "Yes, I have an NID" (same gating as the merchant onboarding
 *    wizard's PersonalInformationPage).
 *  - Profile Photo is always a required upload; NID Photo only renders
 *    (and is required) once "Yes, I have an NID" is chosen.
 */
class VendorWizardPersonalInfoStep extends VendorWizardBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.fullNameInput = page.getByLabel('Full Name', { exact: true });
    this.emailInput = page.getByLabel('Email Address', { exact: true });
    this.mobileNumberInput = page.getByLabel('Mobile Number', { exact: true });
    this.hasNidYesButton = page.getByRole('button', { name: 'Yes, I have an NID' });
    this.hasNidNoButton = page.getByRole('button', { name: "No, I don't have an NID" });
    this.nidNumberInput = page.getByLabel('NID Number', { exact: true });
    this.dateOfBirthInput = page.getByLabel('Date of Birth', { exact: true });

    // Hidden file inputs, addressed by document order (no stable
    // label/id) — same convention as the merchant onboarding wizard's
    // PersonalInformationPage/BusinessInformationPage.
    this.profilePhotoInput = page.locator('input[type="file"]').nth(0);
    this.nidPhotoInput = page.locator('input[type="file"]').nth(1);
  }

  /**
   * @param {{
   *   fullName: string,
   *   email: string,
   *   mobileNumber: string,
   *   hasNid?: boolean,
   *   nidNumber?: string,
   *   dateOfBirth?: string,
   *   profilePhotoPath: string,
   *   nidPhotoPath?: string,
   * }} details
   */
  async fillPersonalInformation(details) {
    await this.fullNameInput.fill(details.fullName);
    await this.emailInput.fill(details.email);
    await this.mobileNumberInput.fill(details.mobileNumber);

    if (details.hasNid === false) {
      await this.hasNidNoButton.click();
    } else {
      await this.hasNidYesButton.click();
      if (details.nidNumber) await this.nidNumberInput.fill(details.nidNumber);
      if (details.dateOfBirth) await this.dateOfBirthInput.fill(details.dateOfBirth);
    }

    await this.profilePhotoInput.setInputFiles(details.profilePhotoPath);
    if (details.nidPhotoPath) {
      await this.nidPhotoInput.setInputFiles(details.nidPhotoPath);
    }
  }
}

module.exports = { VendorWizardPersonalInfoStep };
