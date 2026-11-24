// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * Shared behaviour for the 8-step merchant onboarding wizard reached after
 * VerifyMobileOtpPage: Tell us about your business (Merchant Type),
 * Personal Information, Business Information, Business Details,
 * Business Support Details, Contact Persons, Bank Details and finally
 * Review Registration. Each step page object extends this.
 *
 * Confirmed against the live wizard (merchant-dev, 2026-11-24): every step
 * shares the same right-hand progress nav (`Step N of 8`, one button per
 * step, in this exact order) and the same Back / Save & Continue Later /
 * Save & Continue footer. Save & Continue is a `type="submit"` button and
 * only advances once the step's required fields validate.
 */
class MerchantBasePage extends BasePage {
  static STEP_LABELS = [
    'Tell us about your business',
    'Personal Information',
    'Business Information',
    'Business Details',
    'Business Support Details',
    'Contact Persons',
    'Bank Details',
    'Review Registration',
  ];

  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} stepLabel Exact label of this step, from MerchantBasePage.STEP_LABELS.
   */
  constructor(page, stepLabel) {
    super(page);
    this.stepLabel = stepLabel;
    this.stepHeading = page.getByRole('heading', { name: stepLabel, exact: true });
    this.stepNav = page.getByRole('navigation');
    this.backButton = page.getByRole('button', { name: 'Back', exact: true });
    this.saveAndContinueLaterButton = page.getByRole('button', { name: 'Save & Continue Later' });
    this.nextButton = page.getByRole('button', { name: 'Save & Continue', exact: true });
  }

  async goToNextStep() {
    await this.nextButton.click();
  }

  async goToPreviousStep() {
    await this.backButton.click();
  }

  /** @param {string} stepLabel One of MerchantBasePage.STEP_LABELS */
  getStepNavButton(stepLabel) {
    return this.stepNav.getByRole('button', { name: stepLabel, exact: true });
  }
}

module.exports = { MerchantBasePage };
