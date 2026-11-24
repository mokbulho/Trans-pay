// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Verify your mobile number" gate that precedes the 8-step merchant
 * onboarding wizard at /onboarding.
 *
 * Cloudflare Turnstile:
 * As soon as a mobile number is entered, the page renders a Cloudflare
 * Turnstile "Verify you are human" challenge (`#cf-turnstile`) and the
 * "Send OTP" button stays disabled until it passes. Turnstile behaves
 * differently for automated browsers: a real, non-automated Chrome
 * session passes it invisibly in ~1-2s (confirmed manually), but
 * Playwright's automated Chromium is detected and fails with
 * "Turnstile error 300010" in headless mode. This framework never
 * attempts to solve or bypass the widget itself.
 *
 * Dev OTP shortcut (merchant-dev only):
 * The staging `/api/auth/otp/send` endpoint returns a `devOtp` field in
 * its JSON response alongside the real SMS, e.g.
 * `{"mobileNumber":"+8801671696959","expiresInSeconds":120,"devOtp":"247903"}`.
 * This is a dev-environment-only QA convenience (confirmed by inspecting
 * the Network tab), not a security bypass — requestOtp() captures it via
 * `page.waitForResponse` so tests can read the real OTP without needing
 * an SMS inbox, whenever Turnstile lets the request through at all.
 */
class VerifyMobileOtpPage extends BasePage {
  static OTP_SEND_ENDPOINT = '/api/auth/otp/send';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Verify your mobile number' });
    this.mobileNumberInput = page.getByPlaceholder('01XXXXXXXXX');
    this.sendOtpButton = page.getByRole('button', { name: 'Send OTP' });
    this.humanVerificationWidget = page.locator('#cf-turnstile');
    this.verificationFailedMessage = page.getByText('The security check could not be completed.');

    this.changeNumberLink = page.getByRole('button', { name: 'Change' });
    this.otpInput = page.getByPlaceholder('6-digit code');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.resendOtpButton = page.getByRole('button', { name: /resend otp/i });
    this.alreadySentMessage = page.getByText(/code was already sent/i);
  }

  /** @param {string} mobileNumber */
  async enterMobileNumber(mobileNumber) {
    await this.mobileNumberInput.fill(mobileNumber);
  }

  async clickSendOtp() {
    await this.sendOtpButton.click();
  }

  async isHumanVerificationChallengePresent() {
    return (await this.humanVerificationWidget.count()) > 0;
  }

  /**
   * Fills the mobile number and waits for either the Turnstile widget to
   * mount or the "Send OTP" button to become enabled (it shows a brief
   * "Checking..." state either way while Turnstile runs in the
   * background). Does not click the Turnstile widget under any
   * circumstances.
   * @param {string} mobileNumber
   * @returns {Promise<{blockedByCaptcha: boolean}>}
   */
  async waitForMobileNumberAccepted(mobileNumber) {
    await this.enterMobileNumber(mobileNumber);

    await Promise.race([
      this.humanVerificationWidget.waitFor({ state: 'attached' }).catch(() => {}),
      this.sendOtpButton.and(this.page.locator(':enabled')).waitFor({ state: 'visible' }).catch(() => {}),
      this.page.waitForTimeout(8_000),
    ]);

    return { blockedByCaptcha: await this.isHumanVerificationChallengePresent() };
  }

  /**
   * Fills the mobile number, waits past the Turnstile gate, clicks
   * "Send OTP", and — on the merchant-dev environment only — captures the
   * `devOtp` the backend echoes back so the caller can log in without an
   * SMS inbox. Returns `devOtp: null` on any other environment or if the
   * response shape ever changes.
   * @param {string} mobileNumber
   * @returns {Promise<{blockedByCaptcha: boolean, devOtp: string | null}>}
   */
  async requestOtp(mobileNumber) {
    const { blockedByCaptcha } = await this.waitForMobileNumberAccepted(mobileNumber);
    if (blockedByCaptcha || !(await this.sendOtpButton.isEnabled())) {
      return { blockedByCaptcha: true, devOtp: null };
    }

    const responsePromise = this.page
      .waitForResponse((res) => res.url().includes(VerifyMobileOtpPage.OTP_SEND_ENDPOINT), { timeout: 15_000 })
      .catch(() => null);

    await this.clickSendOtp();

    const response = await responsePromise;
    let devOtp = null;
    if (response) {
      try {
        const body = await response.json();
        devOtp = body.devOtp ?? null;
      } catch {
        devOtp = null;
      }
    }

    return { blockedByCaptcha: false, devOtp };
  }

  /** @param {string} otp */
  async enterOtp(otp) {
    await this.otpInput.fill(otp);
  }

  async submitOtp() {
    await this.loginButton.click();
  }

  /**
   * Convenience wrapper: request the OTP, read the dev-mode `devOtp` from
   * the API response, and log in with it in one call.
   * @param {string} mobileNumber
   * @returns {Promise<{blockedByCaptcha: boolean}>}
   */
  async loginWithDevOtp(mobileNumber) {
    const { blockedByCaptcha, devOtp } = await this.requestOtp(mobileNumber);
    if (blockedByCaptcha || !devOtp) {
      return { blockedByCaptcha: true };
    }
    await this.enterOtp(devOtp);
    await this.submitOtp();
    return { blockedByCaptcha: false };
  }
}

module.exports = { VerifyMobileOtpPage };
