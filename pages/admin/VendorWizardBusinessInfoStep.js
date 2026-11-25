// @ts-check
const { VendorWizardBasePage } = require('./VendorWizardBasePage');

/**
 * Step 2 of 4 — "Business Information": business profile and location.
 * Confirmed live against merchant-dev (2026-11-25) — the exact same
 * pattern as the merchant onboarding wizard's BusinessInformationPage:
 *  - Division is a plain native `<select>`.
 *  - District and Upazila are the custom "Search and select" dropdown
 *    (see BasePage.selectFromSearchDropdown) and cascade: District is
 *    disabled (native select reading "Choose the previous option
 *    first") until Division is chosen, Upazila until District is
 *    chosen. Not every Upazila option exists for every District — e.g.
 *    "Gulshan" does not exist under Dhaka District here, only Thana-
 *    level names like Banani/Badda/Bangshal/Cantonment do.
 *  - Business Logo is optional; Shop/Office Image and Authorized
 *    Signature are required uploads.
 */
class VendorWizardBusinessInfoStep extends VendorWizardBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.businessNameInput = page.getByLabel('Business Name', { exact: true });
    this.ownerNameInput = page.getByLabel('Owner Name', { exact: true });
    this.ownerBrsNoInput = page.getByLabel('Owner BRS No', { exact: true });

    this.divisionSelect = page.getByLabel('Division', { exact: true });
    // District/Upazila are custom dropdown buttons once enabled, not
    // real form controls, so getByLabel doesn't reach them — target via
    // DOM adjacency instead (same as BusinessInformationPage.js).
    this.districtTrigger = page.locator('label:has-text("District") + button');
    this.upazilaTrigger = page.locator('label:has-text("Upazila") + button');
    this.postalCodeInput = page.getByLabel('Postal Code', { exact: true });

    this.streetInput = page.getByLabel('Village/Street/Moholla', { exact: true });
    this.fullAddressInput = page.getByLabel('Full Business Address', { exact: true });

    // Verification Assets, in document order: Business Logo (optional),
    // Shop/Office Image (required), Authorized Signature (required).
    this.businessLogoInput = page.locator('input[type="file"]').nth(0);
    this.shopImageInput = page.locator('input[type="file"]').nth(1);
    this.authorizedSignatureInput = page.locator('input[type="file"]').nth(2);
  }

  /**
   * @param {{
   *   businessName: string,
   *   ownerName: string,
   *   ownerBrsNo?: string,
   *   division: string,
   *   district: string,
   *   upazila: string,
   *   postalCode: string,
   *   street: string,
   *   fullAddress: string,
   *   shopImagePath: string,
   *   authorizedSignaturePath: string,
   *   businessLogoPath?: string,
   * }} details
   */
  async fillBusinessInformation(details) {
    await this.businessNameInput.fill(details.businessName);
    await this.ownerNameInput.fill(details.ownerName);
    if (details.ownerBrsNo) await this.ownerBrsNoInput.fill(details.ownerBrsNo);

    await this.divisionSelect.selectOption({ label: details.division });
    await this.selectFromSearchDropdown(this.districtTrigger, details.district);
    await this.selectFromSearchDropdown(this.upazilaTrigger, details.upazila);
    await this.postalCodeInput.fill(details.postalCode);

    await this.streetInput.fill(details.street);
    await this.fullAddressInput.fill(details.fullAddress);

    if (details.businessLogoPath) {
      await this.businessLogoInput.setInputFiles(details.businessLogoPath);
    }
    await this.shopImageInput.setInputFiles(details.shopImagePath);
    await this.authorizedSignatureInput.setInputFiles(details.authorizedSignaturePath);
  }
}

module.exports = { VendorWizardBusinessInfoStep };
