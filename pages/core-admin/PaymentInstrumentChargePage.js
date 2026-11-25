// @ts-check
const { CoreAdminBasePage } = require('./CoreAdminBasePage');

/**
 * Charge & Rate Config → Payment Instrument Charge
 * (`/bank/instrument-rate-and-charge`). Confirmed live (2026-11-25): the
 * platform-wide Actual-Rate/Rate-to-Charge table behind every
 * instrument (46 records across 5 pages at the default 10/page — the
 * "Rows per page" selector offers up to 100). TP_SANDBOX_PG (id 1,
 * Merchant Type "Default") is confirmed Actual Rate 1 / Rate To Charge
 * 1.5 / "Bill + Transpay charge + other charge + margin" — the exact
 * figures this project's chargeDistribution test data independently
 * reverse-engineered from real transactions before this page was found.
 */
class PaymentInstrumentChargePage extends CoreAdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Payment Instrument Charge' });
    this.filterInput = page.getByPlaceholder('Filter');
    this.addButton = page.getByRole('button', { name: 'Add', exact: true });
    this.rowsPerPageSelect = page.getByRole('combobox').filter({ hasText: /^\d+$/ }).first();
  }

  /** @param {string} query */
  async filter(query) {
    await this.filterInput.fill(query);
  }

  /** Opens the Edit/View dialog for the row currently shown by `filter()`. */
  async clickEditView() {
    await this.page.getByRole('button', { name: 'Edit/View' }).click();
  }
}

module.exports = { PaymentInstrumentChargePage };
