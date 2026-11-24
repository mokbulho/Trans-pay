// @ts-check
const { BasePage } = require('../base/BasePage');
const { environment } = require('../../config/environment');

/**
 * Test-merchant checkout tool's "Merchant settings" page
 * (`{testMerchantBaseUrl}/settings`) — confirmed live (2026-11-24). This
 * is the real "Make payment" feature the Admin Console doesn't have: a
 * standalone site, not behind Cloudflare Turnstile and not requiring any
 * sign-in, where a merchant's core-platform credentials (issued via the
 * Admin Console's Rotate API secret / Rotate webhook secret) are
 * registered as a "profile" so test payments can be driven through the
 * real Transpay checkout.
 *
 * "New payments use the active profile" — each row is Profile / Username
 * / Webhook secret / Webhook host, with Activate / Test login / Edit /
 * Delete actions (Activate and Delete are hidden on the currently-active
 * row).
 */
class MerchantSettingsPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Merchant settings' });
    this.payingAsBanner = page.locator('p', { hasText: 'Paying as' });

    this.labelInput = page.getByLabel('Label');
    this.baseUrlInput = page.getByLabel('Base URL');
    this.merchantUsernameInput = page.getByLabel('Merchant username');
    this.passKeyInput = page.getByLabel('Pass key');
    this.webhookSecretInput = page.getByLabel('Webhook secret');
    this.webhookHostInput = page.getByLabel('Webhook host');
    this.addProfileButton = page.getByRole('button', { name: 'Add profile' });
  }

  async open() {
    await this.goto(`${environment.testMerchantBaseUrl}/settings`);
  }

  /** @param {string} profileLabel Exact label/username as shown in the PROFILE column. */
  row(profileLabel) {
    return this.page.getByRole('row', { name: new RegExp(escapeRegExp(profileLabel)) });
  }

  /** @param {string} profileLabel */
  async activate(profileLabel) {
    await this.row(profileLabel).getByRole('button', { name: 'Activate' }).click();
  }

  /**
   * Registers a new merchant profile. The Pass key / Webhook secret must
   * come from the Admin Console's Rotate API secret / Rotate webhook
   * secret dialogs (ApiSecretsDialog) — shown once, never persisted here.
   * @param {{label: string, baseUrl?: string, merchantUsername: string, passKey: string, webhookSecret: string, webhookHost?: string}} profile
   */
  async addProfile({
    label,
    baseUrl = 'https://transpay.dev.transpay.com.bd/transpaypg',
    merchantUsername,
    passKey,
    webhookSecret,
    webhookHost = environment.testMerchantBaseUrl,
  }) {
    await this.labelInput.fill(label);
    await this.baseUrlInput.fill(baseUrl);
    await this.merchantUsernameInput.fill(merchantUsername);
    await this.passKeyInput.fill(passKey);
    await this.webhookSecretInput.fill(webhookSecret);
    await this.webhookHostInput.fill(webhookHost);
    await this.addProfileButton.click();
  }
}

/** @param {string} value */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { MerchantSettingsPage };
