// @ts-check
const { MerchantBasePage } = require('./MerchantBasePage');

/**
 * Step 2 of 8 — "Personal Information": the primary account holder's
 * details. Confirmed live against merchant-dev (2026-11-24):
 *  - "NID Number" and "Date of Birth" only render after choosing
 *    "Yes, I have an NID".
 *  - Profile Photo and NID Photo are both required uploads.
 *  - Date of Birth is a native `type="date"` input — fill it with an
 *    ISO string ("1990-01-01"), Playwright converts it for the control.
 */
class PersonalInformationPage extends MerchantBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, MerchantBasePage.STEP_LABELS[1]);

    this.fullNameInput = page.getByLabel('Full Name', { exact: true });
    this.emailInput = page.getByLabel('Email Address', { exact: true });
    this.hasNidYesButton = page.getByRole('button', { name: 'Yes, I have an NID' });
    this.hasNidNoButton = page.getByRole('button', { name: "No, I don't have an NID" });
    this.nidNumberInput = page.getByLabel('NID Number', { exact: true });
    this.dateOfBirthInput = page.getByLabel('Date of Birth', { exact: true });

    // The upload controls are custom drop-zones around a hidden
    // `<input type="file">`; there is no stable label/id to target them
    // by, so they are addressed by document order (Profile Photo is the
    // first file input on this step, NID Photo the second).
    this.profilePhotoInput = page.locator('input[type="file"]').nth(0);
    this.nidPhotoInput = page.locator('input[type="file"]').nth(1);
  }

  /**
   * @param {{
   *   fullName: string,
   *   email: string,
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

module.exports = { PersonalInformationPage };
