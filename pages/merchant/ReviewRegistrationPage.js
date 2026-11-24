// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * Step 8 of 8 — "Review Registration". Confirmed live against
 * merchant-dev (2026-11-24): one card per prior step, each with its own
 * "Edit" link back to that step, a single terms checkbox, and a
 * "Submit Registration" button (not "Save & Continue" — this is the only
 * step that doesn't use that label). Submitting navigates (same URL,
 * `?step=review`) into ApplicationStatusPage's "Registration submitted
 * successfully" screen — assert on that page object after submitApplication().
 */
class ReviewRegistrationPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Review Registration', exact: true });
    this.termsCheckbox = page.getByRole('checkbox', { name: /merchant terms and conditions/i });
    this.submitButton = page.getByRole('button', { name: 'Submit Registration' });
  }

  /** @param {string} sectionHeading e.g. "Personal Information", "Bank Details" */
  getSection(sectionHeading) {
    return this.page.locator('div').filter({ has: this.page.getByRole('heading', { name: sectionHeading, exact: true }) }).first();
  }

  /** @param {string} sectionHeading */
  async editSection(sectionHeading) {
    await this.getSection(sectionHeading).getByRole('link', { name: 'Edit' }).click();
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async submitApplication() {
    await this.submitButton.click();
  }
}

module.exports = { ReviewRegistrationPage };
