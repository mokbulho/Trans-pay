// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * "Assign Instrument" page, opened from `CoreMerchantListPage`'s row
 * action menu → Assign Instrument (`/merchant/assign-instrument/:id/:userId`).
 * Confirmed live (2026-11-25): one checkbox per payment method under
 * "Mobile Banking" and "Internet Banking" (confirmed via the
 * accessibility tree — e.g. `getByRole('checkbox', { name: 'TP Sandbox
 * Payment Gateway (simulator)' })`). A further "Wallet" section reads
 * "No payment method configured for this category", and a "Cards"
 * section groups one acquiring-bank picker per network (Visa,
 * Mastercard, American Express, TakaPay) with a per-network "Clear"
 * link — seen visually as circular selectable tiles, but its exact
 * accessible roles weren't confirmed, so this page object doesn't yet
 * expose a helper for it. "Save Assignment" shows a live count badge of
 * how many instruments are currently assigned.
 */
class AssignInstrumentPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Assign Instrument' });
    // .first(): confirmed live this resolves to 2 identical matches (a
    // responsive-duplicate render), not two different buttons.
    this.backButton = page.getByRole('button', { name: 'Back' }).first();
    this.saveAssignmentButton = page.getByRole('button', { name: 'Save Assignment' });
  }

  /** @param {string} instrumentName e.g. "TP Sandbox Payment Gateway (simulator)" */
  getCheckbox(instrumentName) {
    return this.page.getByRole('checkbox', { name: instrumentName });
  }
}

module.exports = { AssignInstrumentPage };
