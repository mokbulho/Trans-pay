// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Update Merchant" dialog, opened from `CoreMerchantListPage`'s row
 * action menu → Edit Details. Confirmed live (2026-11-25) against
 * merchant Aalo (m1182): Merchant User Id, White Listed IP Address,
 * Mobile Number, Email ID, Address, Company Name, Web URL, Status
 * (Enable/Disable), Merchant Type (a custom searchable dropdown, not a
 * native `<select>` — same pattern as the merchant onboarding wizard's
 * District/Upazila fields), Service Charge Borne By ("Citizen — payer
 * pays it, shown on the checkout" / "Merchant — merchant absorbs it,
 * hidden from the payer"), and an optional Contact Persons repeater.
 */
class EditMerchantDetailsDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): plain text, not a real heading.
    this.heading = page.getByText('Update Merchant', { exact: true });
    this.merchantUserIdInput = page.getByPlaceholder('Enter merchant user id');
    this.whiteListedIpInput = page.getByPlaceholder('e.g. 127.0.0.1 or 10.0.0.1,10.0.0.2');
    this.mobileNumberInput = page.getByPlaceholder('1XXXXXXXXX or 01XXXXXXXXX');
    this.emailInput = page.getByPlaceholder('Enter email id');
    this.addressInput = page.getByPlaceholder('Enter address');
    this.companyNameInput = page.getByPlaceholder('Enter company');
    this.webUrlInput = page.getByPlaceholder('e.g. example.com or https://example.com');
    // Status and Service Charge Borne By are native <select>s whose
    // accessible name is their *current* selected option, so they are
    // targeted by DOM position (the field immediately after its label)
    // rather than by name — matches the project's existing convention
    // for this "label + control" layout (see VendorWizardBusinessInfoStep.js).
    this.statusSelect = page.locator('label:has-text("Status") + select');
    this.merchantTypeTrigger = page.locator('label:has-text("Merchant Type") + *').first();
    this.serviceChargeBorneBySelect = page.locator('label:has-text("Service Charge Borne By") + select');
    this.addContactPersonButton = page.getByRole('button', { name: 'Add' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  async cancel() {
    await this.cancelButton.click();
  }
}

module.exports = { EditMerchantDetailsDialog };
