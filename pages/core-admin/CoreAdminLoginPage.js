// @ts-check
const { BasePage } = require('../base/BasePage');
const { environment } = require('../../config/environment');

/**
 * Sign-in screen for the **core platform** admin console
 * (`{coreAdminBaseUrl}/login`) — a separate site/login from the
 * merchant-dev Admin Console (see `AdminLoginPage.js`). Confirmed live
 * (2026-11-25): no Cloudflare Turnstile widget renders here, so this
 * login is expected to work under Playwright for real, unlike the
 * merchant-dev one.
 *
 * A successful login redirects to `/dashboard/admin`. Visiting `/login`
 * while already signed in (session cookie present) redirects straight
 * there too — confirmed live.
 */
class CoreAdminLoginPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: /remember me/i });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  async open() {
    await this.page.goto(`${environment.coreAdminBaseUrl}/login`);
  }

  /**
   * @param {string} [username] Defaults to environment.coreAdminUsername.
   * @param {string} [password] Defaults to environment.coreAdminPassword.
   */
  async login(username = environment.coreAdminUsername, password = environment.coreAdminPassword) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await this.page.waitForURL('**/dashboard/admin');
  }
}

module.exports = { CoreAdminLoginPage };
