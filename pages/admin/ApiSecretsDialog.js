// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Copy these secrets now" dialog shown exactly once, immediately after
 * a successful approval. Confirmed live against merchant-dev
 * (2026-11-24): shows a freshly generated API secret and Webhook secret
 * that Transpay does not keep/show again; "Done" is disabled until the
 * "I have stored these secrets safely" checkbox is ticked.
 *
 * Deliberately exposes no getters for the actual secret values — they're
 * randomly generated per approval and this framework has no business
 * asserting on or persisting real generated credentials.
 */
class ApiSecretsDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.dialog = page.getByRole('dialog', { name: 'Copy these secrets now' });
    this.copyApiSecretButton = this.dialog.getByRole('button', { name: 'Copy API secret' });
    this.copyWebhookSecretButton = this.dialog.getByRole('button', { name: 'Copy Webhook secret' });
    this.storedSafelyCheckbox = this.dialog.getByRole('checkbox');
    this.doneButton = this.dialog.getByRole('button', { name: 'Done' });
  }

  async acknowledgeAndClose() {
    await this.storedSafelyCheckbox.check();
    await this.doneButton.click();
  }
}

module.exports = { ApiSecretsDialog };
