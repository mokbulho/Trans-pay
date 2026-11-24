// @ts-check
const { BasePage } = require('../base/BasePage');
const { environment } = require('../../config/environment');

/**
 * Admin/merchant shared sign-in screen at `/login`.
 *
 * Cloudflare Turnstile:
 * Confirmed live against merchant-dev (2026-11-24) via a direct headless
 * Playwright probe: this form DOES render a Cloudflare Turnstile widget
 * (`#cf-turnstile`), and the "Sign in" button stays disabled until it
 * passes — same mechanism as the merchant onboarding wizard's mobile
 * verification step (see VerifyMobileOtpPage.js). The token never
 * resolved even after 40s under headless Playwright, while a real,
 * non-automated Chrome session (used for this suite's live verification
 * pass) passed it invisibly in ~3s. An earlier pass at this file
 * incorrectly assumed no Turnstile was present here, because it was only
 * ever exercised through a real browser — never through Playwright
 * itself. This framework never attempts to solve or bypass the widget.
 *
 * A successful admin login lands on `/admin` (Admin Dashboard).
 */
class AdminLoginPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.emailOrMobileInput = page.getByPlaceholder('you@company.com or 01XXXXXXXXX');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
    this.signInWithOtpLink = page.getByRole('link', { name: 'Sign in with OTP' });
    this.keepMeSignedInCheckbox = page.getByRole('checkbox', { name: /keep me signed in/i });
    this.humanVerificationWidget = page.locator('#cf-turnstile');
  }

  async open() {
    await this.page.goto('/login');
  }

  async isHumanVerificationChallengePresent() {
    return (await this.humanVerificationWidget.count()) > 0;
  }

  /**
   * Fills the credentials and waits for the "Sign in" button to become
   * enabled (Turnstile resolves invisibly in ~3s in a real browser). If it
   * is still disabled after the wait, reports `blockedByCaptcha: true`
   * instead of clicking a disabled button.
   * @param {string} [email] Defaults to environment.adminEmail.
   * @param {string} [password] Defaults to environment.adminPassword.
   * @returns {Promise<{blockedByCaptcha: boolean}>}
   */
  async login(email = environment.adminEmail, password = environment.adminPassword) {
    await this.emailOrMobileInput.fill(email);
    await this.passwordInput.fill(password);

    await this.signInButton
      .and(this.page.locator(':enabled'))
      .waitFor({ state: 'visible', timeout: 10_000 })
      .catch(() => {});

    // isEnabled() can itself throw (not just return false) if Turnstile's
    // DOM churn leaves the button transiently unattached/unstable —
    // observed live under parallel workers. Treat that the same as
    // "still disabled" rather than letting it fail the test.
    const isEnabled = await this.signInButton.isEnabled({ timeout: 5_000 }).catch(() => false);
    if (!isEnabled) {
      return { blockedByCaptcha: true };
    }

    await this.signInButton.click();
    return { blockedByCaptcha: false };
  }
}

module.exports = { AdminLoginPage };
