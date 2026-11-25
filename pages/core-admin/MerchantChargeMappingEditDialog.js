// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Edit Merchant Charge Mapping" dialog, opened from
 * `MerchantChargeMappingPage.clickEdit()`. Confirmed live (2026-11-25)
 * against Aalo (mer-45610001): User Category and Name are read-only;
 * Configuration Type and the top-level Charge Type are custom,
 * unlabelled dropdowns (text-proximity locators, same convention as the
 * merchant onboarding wizard's searchable dropdowns); Is Active, In
 * percentage and Discount Amount Type are native selects. Below an
 * "UPDATE RATE SETUP" divider sits the actual rate: a *second*, plain
 * read-only Charge Type field (PERCENTAGE/FLAT — the TP rate's type,
 * distinct from the top one), Charge Amount, Discount Amount Type and
 * Discount Amount.
 */
class MerchantChargeMappingEditDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): plain text, not a real heading.
    this.heading = page.getByText('Edit Merchant Charge Mapping', { exact: true });
    this.userCategoryInput = page.locator('label:has-text("User Category") + input');
    this.nameInput = page.locator('label:has-text("Name") + input');
    this.configurationTypeTrigger = page.locator('label:has-text("Configuration Type") + *').first();
    this.chargeTypeTrigger = page.locator('label:has-text("Charge Type") + *').first();
    this.isActiveSelect = page.locator('label:has-text("Is Active") + select');
    this.otherChargeInput = page.getByPlaceholder('Leave empty for none');
    this.inPercentageSelect = page.locator('label:has-text("In percentage") + select');

    // "UPDATE RATE SETUP" section.
    this.rateSetupHeading = page.getByText('UPDATE RATE SETUP');
    this.rateChargeTypeInput = page.locator('label:has-text("Charge Type") + input').last();
    this.chargeAmountInput = page.getByPlaceholder('Enter Charge Amount');
    this.discountAmountTypeSelect = page.locator('label:has-text("Discount Amount Type") + select');
    this.discountAmountInput = page.getByPlaceholder('Enter discount amount');

    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  async cancel() {
    await this.cancelButton.click();
  }
}

module.exports = { MerchantChargeMappingEditDialog };
