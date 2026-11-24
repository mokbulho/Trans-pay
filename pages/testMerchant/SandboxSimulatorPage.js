// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * TP Sandbox PG simulator
 * (`transpay.dev.transpay.com.bd/transpaypg/tp_sandbox_pg/simulator/:id`)
 * — reached after GatewayCheckoutPage.payWith('TP_SANDBOX_PG'). Confirmed
 * live (2026-11-24): clearly labelled "SIMULATOR · NOT A BANK — nothing
 * here reaches a bank and no money moves." Requires a shared,
 * per-environment "Simulated authorisation" PIN (`tp_sandbox_pg.pin`,
 * see environment.sandboxSettlePin) before any of its 3 outcome buttons
 * (settle as SUCCESS / Fail / Cancel) will act — explicitly NOT a bank
 * credential, just a guard against a bare link triggering a settle.
 * A wrong PIN increments a shared attempt counter ("Wrong PIN — attempt
 * N of 10") and re-shows this same page rather than failing outright.
 */
class SandboxSimulatorPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.pinInput = page.getByLabel('Simulated authorisation');
    this.settleAsSuccessButton = page.getByRole('button', { name: 'Pay — settle as SUCCESS' });
    this.failButton = page.getByRole('button', { name: 'Fail', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.wrongPinMessage = page.getByText(/Wrong PIN — attempt \d+ of 10\./);
  }

  /** @param {string} pin */
  async enterPin(pin) {
    await this.pinInput.fill(pin);
  }

  /**
   * Enters the PIN and settles the payment as SUCCESS — redirects to
   * PaymentStatusPage.
   * @param {string} pin
   */
  async settleAsSuccess(pin) {
    await this.enterPin(pin);
    await this.settleAsSuccessButton.click();
  }
}

module.exports = { SandboxSimulatorPage };
