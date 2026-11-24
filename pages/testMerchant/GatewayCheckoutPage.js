// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * The real Transpay payment gateway checkout
 * (`transpay.dev.transpay.com.bd/transpaypg/checkout`) — reached from
 * PayPage.payNow(). Confirmed live (2026-11-24): Mobile Banking / Cards
 * / Net Banking tabs, one tile per enabled instrument (named by the
 * instrument's platform code, e.g. "TP_SANDBOX_PG" — only instruments
 * enabled for the paying merchant in Admin's Pricing page appear here),
 * and a "Pay {amount}" button whose total updates ("Incl. Service
 * Charge") once an instrument is selected.
 */
class GatewayCheckoutPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.mobileBankingTab = page.getByRole('link', { name: 'Mobile Banking' });
    this.cardsTab = page.getByRole('link', { name: 'Cards' });
    this.netBankingTab = page.getByRole('link', { name: 'Net Banking' });
    this.payButton = page.getByRole('button', { name: /^Pay/ });
  }

  /** @param {string} instrumentCode e.g. 'TP_SANDBOX_PG' */
  instrumentTile(instrumentCode) {
    return this.page.getByRole('button', { name: instrumentCode, exact: true });
  }

  /**
   * Selects an instrument and submits — redirects to that instrument's
   * own simulator/bank page (e.g. SandboxSimulatorPage for TP_SANDBOX_PG).
   * @param {string} instrumentCode
   */
  async payWith(instrumentCode) {
    await this.instrumentTile(instrumentCode).click();
    await this.payButton.click();
  }
}

module.exports = { GatewayCheckoutPage };
