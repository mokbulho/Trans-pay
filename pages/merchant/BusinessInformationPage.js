// @ts-check
const { MerchantBasePage } = require('./MerchantBasePage');

/**
 * Step 3 of 8 — "Business Information": core business profile and
 * location. Confirmed live against merchant-dev (2026-11-24):
 *  - Division is a plain native `<select>`.
 *  - District and Upazila are the custom "Search and select" dropdown
 *    (see BasePage.selectFromSearchDropdown) and cascade: District is
 *    disabled until Division is chosen, Upazila until District is chosen.
 *  - Business Logo is optional; Shop/Office Image and Authorized
 *    Signature are required uploads.
 */
class BusinessInformationPage extends MerchantBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, MerchantBasePage.STEP_LABELS[2]);

    this.businessNameInput = page.getByLabel('Business Name', { exact: true });
    this.ownerNameInput = page.getByLabel('Owner Name', { exact: true });
    this.ownerBrsNoInput = page.getByLabel('Owner BRS No', { exact: true });

    this.divisionSelect = page.getByLabel('Division', { exact: true });
    // District/Upazila are custom dropdown buttons, not real form controls,
    // so their <label> isn't picked up as their accessible name (confirmed
    // live: the button's name is its current value / "Search and select",
    // not the label text) — target via DOM adjacency instead of getByLabel.
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
   *   ownerBrsNo: string,
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
    await this.ownerBrsNoInput.fill(details.ownerBrsNo);

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

module.exports = { BusinessInformationPage };
