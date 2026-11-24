// @ts-check
const { BasePage } = require('../base/BasePage');
const { environment } = require('../../config/environment');

/**
 * "Pay via Transpay" — the test-merchant tool's home page
 * (`{testMerchantBaseUrl}/`). Confirmed live (2026-11-24): a minimal
 * customer-facing checkout form (Amount, Full name, Mobile number,
 * optional Email) that starts a real payment against whichever profile
 * is currently active on MerchantSettingsPage.
 */
class PayPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.amountInput = page.getByLabel('Amount (BDT)');
    this.fullNameInput = page.getByLabel('Full name');
    this.mobileNumberInput = page.getByLabel('Mobile number');
    this.emailInput = page.getByLabel('Email (optional)');
    this.payNowButton = page.getByRole('button', { name: 'Pay now' });
  }

  async open() {
    await this.goto(environment.testMerchantBaseUrl);
  }

  /**
   * Fills the form and submits — redirects to the real Transpay gateway
   * checkout (GatewayCheckoutPage) on success.
   * @param {{amount: number|string, fullName: string, mobileNumber?: string, email?: string}} payment
   */
  async payNow({ amount, fullName, mobileNumber = '01700000000', email }) {
    await this.amountInput.fill(String(amount));
    await this.fullNameInput.fill(fullName);
    await this.mobileNumberInput.fill(mobileNumber);
    if (email) {
      await this.emailInput.fill(email);
    }
    await this.payNowButton.click();
  }
}

module.exports = { PayPage };
