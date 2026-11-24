// @ts-check
const { MerchantBasePage } = require('./MerchantBasePage');

/**
 * Step 5 of 8 — "Business Support Details": operational and financial
 * details. Confirmed live against merchant-dev (2026-11-24). Business
 * Starting Year is the custom "Search and select" dropdown (a list of
 * years, newest first); the rest are plain text/email/tel inputs.
 */
class BusinessSupportDetailsPage extends MerchantBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, MerchantBasePage.STEP_LABELS[4]);

    this.supportMobileInput = page.getByLabel('Support Mobile Number', { exact: true });
    this.supportEmailInput = page.getByLabel('Support Email', { exact: true });
    // Custom dropdown button; see BusinessInformationPage.js for why
    // getByLabel doesn't reach it.
    this.businessStartingYearTrigger = page.locator('label:has-text("Business Starting Year") + button');
    this.ownerNameSupportInput = page.getByLabel('Owner Name (Support)', { exact: true });
    this.companyNetWorthInput = page.getByLabel('Company Net Worth (Approx)', { exact: true });
    this.monthlyTransactionValueInput = page.getByLabel('Monthly Transaction Value', { exact: true });
    this.mainProductServiceNameInput = page.getByLabel('Main Product / Service Name', { exact: true });
  }

  /**
   * @param {{
   *   supportMobile: string,
   *   supportEmail: string,
   *   businessStartingYear: string,
   *   ownerNameSupport: string,
   *   companyNetWorth: string,
   *   monthlyTransactionValue: string,
   *   mainProductServiceName: string,
   * }} details
   */
  async fillBusinessSupportDetails(details) {
    await this.supportMobileInput.fill(details.supportMobile);
    await this.supportEmailInput.fill(details.supportEmail);
    await this.selectFromSearchDropdown(this.businessStartingYearTrigger, details.businessStartingYear);
    await this.ownerNameSupportInput.fill(details.ownerNameSupport);
    await this.companyNetWorthInput.fill(details.companyNetWorth);
    await this.monthlyTransactionValueInput.fill(details.monthlyTransactionValue);
    await this.mainProductServiceNameInput.fill(details.mainProductServiceName);
  }
}

module.exports = { BusinessSupportDetailsPage };
