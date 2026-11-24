// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * Merchant pricing page (`/admin/merchants/:id/pricing`), reached from an
 * Approved-tab row's "Pricing" link. Confirmed live against merchant-dev
 * (2026-11-24): 4 sections on one page — What it is charged (summary),
 * Payment instruments, Merchant wise rate, Hierarchy.
 *
 * How this maps to the TP_Charge_Distribution_Scenarios.xlsx business
 * model (PI/TP/SM/M/V, see README "Charge distribution"):
 *  - PI → "Payment instruments" (enable/disable) + the Rate Catalogue's
 *    per-instrument rate, optionally overridden per merchant.
 *  - TP → "Merchant wise rate": Transpay's own cut, configured as a flat
 *    percentage "added on top" of the instrument charge.
 *  - V → the same Merchant wise rate form's "Other charge" (Kind: None /
 *    an amount / a percentage) — confirmed on the Vendors page
 *    ("Vendors... can take a merchant's Other Charge").
 *  - SM → "Hierarchy": a sub-merchant's combined rate (instrument +
 *    merchant wise rate) must never be less than its super merchant's —
 *    enforced server-side and checked by the "Super merchant pricing
 *    check" tool on the Applications list.
 *  - M → not a separate rate; the merchant simply receives
 *    `amount − totalCharge` (see the Transactions `merchantOwedAmount`
 *    field).
 *
 * The real model is a markup/spread (TP cut + optional Other Charge on
 * top of the PI rate, with an SM floor rule) rather than the
 * spreadsheet's proportional weight-based split of one total charge —
 * confirmed live, see README.
 */
class MerchantPricingPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.paymentInstrumentsHeading = page.getByRole('heading', { name: 'Payment instruments' });
    this.merchantWiseRateHeading = page.getByRole('heading', { name: 'Merchant wise rate' });
    this.hierarchyHeading = page.getByRole('heading', { name: 'Hierarchy', exact: true });

    this.paymentInstrumentsNavStatus = page.getByRole('button', { name: /^Payment instruments/ });
    this.merchantWiseRateNavStatus = page.getByRole('button', { name: /^Merchant wise rate/ });
    this.hierarchyNavStatus = page.getByRole('button', { name: /^Hierarchy/ });

    this.noInstrumentsEnabledMessage = page.getByText(
      'This merchant has no enabled instruments, so there is nothing it can be paid with yet.'
    );
    this.noMerchantWiseRateMessage = page.getByText('This merchant has no merchant wise rate.');
    this.setMerchantWiseRateButton = page.getByRole('button', { name: 'Set a merchant wise rate' });

    // "Merchant wise rate" form (opened by setMerchantWiseRateButton).
    // Percentage/Try-an-amount are real <label for> inputs; the "Kind"
    // <select> is only a visual label with no `for` (confirmed live), so
    // it needs a structural locator instead of getByLabel().
    this.percentageChargeInput = page.getByLabel('Percentage charge (%)');
    this.otherChargeKindSelect = page
      .locator('label', { hasText: 'Kind' })
      .locator('xpath=following-sibling::div[1]//select');
    this.trySimulateAmountInput = page.getByLabel('Try an amount (BDT)');
    this.saveMerchantWiseRateButton = page.getByRole('button', { name: 'Save merchant wise rate' });
    this.cancelMerchantWiseRateButton = page
      .getByRole('button', { name: 'Cancel', exact: true })
      .first();

    this.noHierarchyMessage = page.getByText('This merchant trades on its own', { exact: false });

    // "What it is charged" summary's own worked example (distinct from the
    // one inside the Merchant wise rate form) — a real `<label>` wraps the
    // input with no `for`, but Playwright's getByLabel() still matches an
    // implicit wrapping label.
    this.summaryWorkedExampleAmountInput = page.getByLabel('Worked example on a bill of ৳');
    this.summaryWorkedExampleBreakdown = page.locator('div', { has: page.getByText('Payer pays') });
  }

  /**
   * Reads the "What it is charged" summary's worked-example breakdown
   * (Bill, + Merchant wise rate, + Other charge, + each instrument, Payer
   * pays) and returns each row's trailing ৳ amount as a number, keyed by
   * its label. Call after an instrument is enabled — with none enabled
   * the summary shows no breakdown at all.
   * @returns {Promise<Record<string, number>>}
   */
  async readSummaryWorkedExampleBreakdown() {
    const text = await this.summaryWorkedExampleBreakdown.last().innerText();
    /** @type {Record<string, number>} */
    const rows = {};
    for (const line of text.split('\n')) {
      const match = line.match(/^(.+?)\s+৳([\d,]+\.\d{2})$/);
      if (match) {
        rows[match[1].trim()] = Number(match[2].replace(/,/g, ''));
      }
    }
    return rows;
  }

  /** @param {number} merchantId */
  async open(merchantId) {
    await this.goto(`/admin/merchants/${merchantId}/pricing`);
  }

  /** @param {string} merchantName */
  heading(merchantName) {
    return this.page.getByRole('heading', { name: merchantName, exact: true });
  }

  /** @param {string} fieldErrorText e.g. 'The percentage cannot be negative' */
  fieldError(fieldErrorText) {
    return this.page.getByText(fieldErrorText, { exact: true });
  }

  /**
   * Opens the "Set a merchant wise rate" form, fills only the percentage
   * (leaving configuration/charge type at their defaults — Flat X% /
   * Transpay charge added on top), and submits. Does not wait out any
   * resulting validation error; call `fieldError()` afterwards to assert
   * on one.
   * @param {number} percentage
   */
  async attemptMerchantWiseRatePercentage(percentage) {
    await this.setMerchantWiseRateButton.click();
    await this.percentageChargeInput.fill(String(percentage));
    await this.saveMerchantWiseRateButton.click();
  }
}

module.exports = { MerchantPricingPage };
