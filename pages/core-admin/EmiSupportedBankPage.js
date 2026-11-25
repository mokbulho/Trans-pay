// @ts-check
const { CoreAdminBasePage } = require('./CoreAdminBasePage');

/**
 * EMI Setting → EMI Supported Bank
 * (`/transpay-emi/emi-supported-bank/list`). Confirmed live
 * (2026-11-25): the platform-wide registry of which banks offer EMI at
 * all, each with a Payment Instrument Code and a display/priority order
 * (Preference No) — United Commercial Bank Limited (UCBL) first,
 * Eastern Bank (EBL) last. All 5 Active.
 */
class EmiSupportedBankPage extends CoreAdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'EMI Supported Banks' });
    this.searchInput = page.getByPlaceholder('Search...');
    this.addEmiSupportedBankButton = page.getByRole('button', { name: 'Add EMI Supported Bank' });
  }

  /** @param {string} bankName e.g. "Brac Bank" */
  getRow(bankName) {
    return this.page.getByRole('row', { name: new RegExp(bankName) });
  }
}

module.exports = { EmiSupportedBankPage };
