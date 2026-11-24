// @ts-check

/**
 * Final payment status page on the test-merchant tool
 * (`{testMerchantBaseUrl}/payment/success|fail|cancel?transId=...`) —
 * reached after the gateway/simulator redirects back. Confirmed live
 * (2026-11-24): a plain "SUCCESS" / "FAILED" / "CANCELLED" heading, a
 * one-line message, and the platform transaction id.
 */
class PaymentStatusPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.successHeading = page.getByRole('heading', { name: 'SUCCESS' });
    this.transactionId = page.getByText(/^Transaction: /);
  }

  /** @returns {Promise<string | null>} The platform transaction id, e.g. "TPC-20261124-114897-bd59f7". */
  async getTransactionId() {
    const text = await this.transactionId.textContent();
    return text?.replace('Transaction:', '').trim() ?? null;
  }
}

module.exports = { PaymentStatusPage };
