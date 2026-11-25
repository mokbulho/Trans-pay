// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Appearance Settings" dialog, opened from `CoreMerchantListPage`'s row
 * action menu → Appearance Settings. Confirmed live (2026-11-25): just
 * two fields — Brand Name and an "Upload Logo (PNG or JPEG)" file input.
 */
class AppearanceSettingsDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): plain text, not a real heading.
    this.heading = page.getByText('Appearance Settings', { exact: true });
    this.brandNameInput = page.getByPlaceholder('Enter the brand name shown on the checkout');
    this.uploadLogoInput = page.locator('input[type="file"]');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
  }

  async cancel() {
    await this.cancelButton.click();
  }
}

module.exports = { AppearanceSettingsDialog };
