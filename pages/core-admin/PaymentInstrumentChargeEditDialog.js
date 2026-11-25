// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Update Rate Setup" dialog, opened from
 * `PaymentInstrumentChargePage.clickEditView()`. Confirmed live
 * (2026-11-25) against TP_SANDBOX_PG (id 1): Instrument And Method Name
 * and Merchant Type are custom unlabelled dropdowns; Is Rate in
 * Percentage / Is Discount in Percentage / Is Active are three separate
 * native True/False selects (disambiguated here by label text, since
 * all three otherwise share the same accessible name); "Bank's
 * percentage is taken on" is a native select with exactly 3 options —
 * "Bill only", "Bill + Transpay charge + other charge + margin",
 * "Total paid amount" — confirmed none of the platform's 46 instruments
 * actually use "Bill only" live. "Apply minimum/maximum charge" are
 * toggle switches, both off for all 46 confirmed records.
 */
class PaymentInstrumentChargeEditDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByText('Update Rate Setup');
    this.instrumentAndMethodNameTrigger = page.locator('label:has-text("Instrument And Method Name") + *').first();
    this.isRateInPercentageSelect = page.locator('label:has-text("Is Rate in Percentage") + select');
    this.actualRateInput = page.getByPlaceholder('Enter actual rate');
    this.rateToChargeInput = page.getByPlaceholder('Enter rate to charge');
    this.bankPercentageTakenOnSelect = page.locator('label:has-text("Bank\'s percentage is taken on") + select');
    this.applyMinimumChargeSwitch = page.getByRole('switch', { name: 'Apply minimum charge' });
    this.applyMaximumChargeSwitch = page.getByRole('switch', { name: 'Apply maximum charge' });
    this.isDiscountInPercentageSelect = page.locator('label:has-text("Is Discount in Percentage") + select');
    this.discountChargeInput = page.getByPlaceholder('Enter discount charge');
    this.applicableFromInput = page.getByPlaceholder('dd/mm/yyyy').first();
    this.applicableToInput = page.getByPlaceholder('dd/mm/yyyy').last();
    this.remarksInput = page.getByPlaceholder('Enter remarks');
    this.isActiveSelect = page.locator('label:has-text("Is Active") + select');
    this.merchantTypeTrigger = page.locator('label:has-text("Merchant Type") + *').first();

    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  async cancel() {
    await this.cancelButton.click();
  }
}

module.exports = { PaymentInstrumentChargeEditDialog };
