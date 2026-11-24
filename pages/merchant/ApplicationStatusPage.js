// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * The post-login/post-submit application status screen at `/onboarding`.
 * Confirmed live against merchant-dev (2026-11-24): this exact screen
 * renders in two situations that share the same layout (Application ID,
 * Status badge, a 3-step timeline, and Home / Download / Contact Support
 * actions):
 *
 *  1. Right after OTP login, for a mobile number that already has an
 *     application on file — e.g. "You are approved" (status: Approved) —
 *     the wizard is skipped entirely.
 *  2. Right after ReviewRegistrationPage.submitApplication() for a brand
 *     new application — "Registration submitted successfully"
 *     (status: Awaiting review).
 *
 * Because a mobile number is consumed once it has an application, the
 * fixed `MERCHANT_MOBILE_NUMBER` test number will eventually land on (1)
 * instead of a blank wizard — `hasExistingApplication()` exists so tests
 * can detect that (regardless of its status) and skip cleanly instead of
 * failing on missing wizard fields. See data/merchant/merchantTestData.js
 * and README.md.
 *
 * NOTE: an earlier version of this page object only checked
 * `approvedHeading` for "already registered", which was wrong — a number
 * sitting at "Awaiting review" also skips the wizard on login and would
 * have slipped past that check. `hasExistingApplication()` checks either
 * heading; `isApproved()` / `isAwaitingReview()` exist for asserting the
 * specific status.
 */
class ApplicationStatusPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.successHeading = page.getByRole('heading', { name: 'Registration submitted successfully' });
    this.approvedHeading = page.getByRole('heading', { name: 'You are approved' });
    this.homeButton = page.getByRole('link', { name: 'Home' }).or(page.getByRole('button', { name: 'Home' }));
    this.goToDashboardButton = page.getByRole('link', { name: 'Go to Dashboard' });
    this.downloadPdfButton = page.getByRole('button', { name: /download application/i });
  }

  async isShown() {
    return (await this.successHeading.or(this.approvedHeading).count()) > 0;
  }

  /** True whenever this mobile number already has an application, whatever its status. */
  async hasExistingApplication() {
    return this.isShown();
  }

  async isApproved() {
    return (await this.approvedHeading.count()) > 0;
  }

  async isAwaitingReview() {
    return (await this.successHeading.count()) > 0;
  }

  /** @returns {Promise<string | null>} e.g. "TP-2026-000094" */
  async getApplicationId() {
    const text = await this.page.locator('main').innerText();
    return text.match(/Application ID\s*\n?\s*(TP-\d{4}-\d+)/)?.[1] ?? null;
  }

  /** @returns {Promise<string | null>} e.g. "Awaiting review" or "Approved" */
  async getStatus() {
    const text = await this.page.locator('main').innerText();
    return text.match(/Status\s*\n?\s*(Approved|Awaiting review)/)?.[1] ?? null;
  }
}

module.exports = { ApplicationStatusPage };
