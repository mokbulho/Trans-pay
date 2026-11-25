// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Merchant Bank Details" dialog, opened from `CoreMerchantListPage`'s
 * row action menu → Bank Details. Confirmed live (2026-11-25) against
 * Aalo (PRIME BANK LTD., ADAMJEE EPZ branch, account 659000000000,
 * routing 170670036, T+1 settlement). Bank Name and Branch are custom
 * searchable dropdowns (each with its own "Clear all" button), not
 * native selects.
 */
class BankDetailsDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Confirmed live (under Playwright): plain text, not a real heading.
    this.heading = page.getByText('Merchant Bank Details', { exact: true });
    this.bankNameTrigger = page.locator('label:has-text("Bank Name") + *').first();
    this.branchTrigger = page.locator('label:has-text("Branch") + *').first();
    this.accountNumberInput = page.getByPlaceholder('Enter account number');
    this.accountHolderNameInput = page.getByPlaceholder('Enter account holder name');
    this.branchCityInput = page.getByPlaceholder('Branch city');
    this.routingNumberInput = page.getByPlaceholder('Routing number');
    this.settlementCycleSelect = page.locator('label:has-text("Settlement Cycle") + select');
    this.holdingTimeInput = page.getByPlaceholder('Holding time');
    this.floatingPointSelect = page.locator('label:has-text("Floating Point") + select');
    this.statusSelect = page.locator('label:has-text("Status") + select');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  async cancel() {
    await this.cancelButton.click();
  }
}

module.exports = { BankDetailsDialog };
