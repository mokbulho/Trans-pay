// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * A single vendor's page (`/admin/vendors/:id`) once it is past the
 * Draft wizard — i.e. "Awaiting approval", "Approved" or "Sent back".
 * Confirmed live against merchant-dev (2026-11-25).
 *
 * Status badge text is one of: Draft, Awaiting approval, Approved,
 * Sent back.
 *
 * The Decision panel (only rendered while "Awaiting approval") offers
 * "Send back" and "Approve". Approve opens a dialog (aria-label
 * "Approve VND-XXXXXXXX") listing only approved merchants with no
 * super merchant ("they own their Other Charge") as a checkbox list —
 * merchant selection is optional, "merchants can be attached later".
 *
 * Once decided, the "Merchants" section lists every merchant this
 * vendor is attached to, who is actually paid that merchant's Other
 * Charge ("The merchant" or "This vendor (VND-XXXXXXXX)"), and row
 * actions: toggle who is paid ("Pay Other Charge to this vendor" /
 * "Pay Other Charge to merchant"), "Change start date", "Detach".
 * "Show history"/"Attached now" toggles an extra "Until" column.
 *
 * IMPORTANT business rule confirmed live: scheduling a second vendor to
 * receive the SAME merchant's Other Charge cannot take effect "now" if
 * another vendor already holds that route as of today — the dialog's
 * own copy names the next day it is free ("The earliest day is ...").
 * Attaching a second vendor to a merchant that already pays a different
 * vendor is harmless by itself; only confirming "Pay Other Charge to
 * this vendor" on the second one schedules the actual override.
 */
class VendorDetailPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.vendorHeading = page.getByRole('heading', { name: /^VND-\d+/ });
    this.statusBadge = page
      .locator('main')
      .getByText(/^(Draft|Awaiting approval|Approved|Sent back)$/, { exact: true })
      .first();
    this.deleteDraftButton = page.getByRole('button', { name: 'Delete draft' });

    // Decision panel (Awaiting approval only).
    this.sendBackButton = page.getByRole('button', { name: 'Send back' });
    this.approveButton = page.getByRole('button', { name: 'Approve', exact: true });

    // Merchants section.
    this.merchantsHeading = page.getByRole('heading', { name: 'Merchants', exact: true });
    this.attachMerchantsButton = page.getByRole('button', { name: 'Attach merchants' });
    this.showHistoryToggle = page.getByRole('button', { name: /^(Show history|Attached now)$/ });
    this.notAttachedToAnyMerchantMessage = page.getByText('Not attached to any merchant.');

    this.toast = page.locator('[role="status"], [role="alert"]').last();
  }

  /** @param {string} reference e.g. 'VND-00000003' */
  async open(reference) {
    const id = reference.replace(/\D/g, '').replace(/^0+/, '');
    await this.page.goto(`/admin/vendors/${id}`);
  }

  async getStatus() {
    return (await this.statusBadge.textContent())?.trim();
  }

  /** @param {string} merchantName e.g. 'Aalo' */
  getMerchantRow(merchantName) {
    return this.page.getByRole('row', { name: new RegExp(`^${escapeRegExp(merchantName)}`) });
  }

  /**
   * Opens the Approve dialog, optionally ticks one or more merchants
   * (checkbox accessible name == merchant name, e.g. "Aalo" — only
   * approved, no-super-merchant merchants are listed), then confirms.
   * @param {string[]} [merchantNames]
   */
  async approve(merchantNames = []) {
    await this.approveButton.click();
    const dialog = this.page.getByRole('dialog', { name: /^Approve VND-/ });
    for (const name of merchantNames) {
      await dialog.getByRole('checkbox', { name, exact: true }).click();
    }
    await dialog.getByRole('button', { name: 'Approve', exact: true }).click();
  }

  /**
   * Opens a merchant row's "Attach merchants" picker is a separate flow;
   * this toggles who is paid that merchant's Other Charge. Confirmed
   * live: the confirm button's label matches the direction ("Pay this
   * vendor" when routing to the vendor, "Pay the merchant" otherwise).
   * @param {string} merchantName
   * @param {string} reason Required; kept in the history.
   * @param {'vendor'|'merchant'} payTo
   */
  async setOtherChargePayout(merchantName, reason, payTo = 'vendor') {
    const row = this.getMerchantRow(merchantName);
    const toggleButton = row.getByRole('button', {
      name: payTo === 'vendor' ? 'Pay Other Charge to this vendor' : 'Pay Other Charge to merchant',
    });
    await toggleButton.click();

    const dialog = this.page.getByRole('dialog', { name: /^Pay .+'s Other Charge to (VND-|the merchant)/ });
    await dialog.getByLabel('Reason', { exact: true }).fill(reason);
    await dialog.getByRole('button', { name: /^Pay (this vendor|the merchant)$/ }).click();
  }

  /**
   * @param {string} merchantName
   * @param {string} reason Required; kept in the history.
   */
  async detach(merchantName, reason) {
    const row = this.getMerchantRow(merchantName);
    await row.getByRole('button', { name: 'Detach' }).click();

    const dialog = this.page.getByRole('dialog', { name: /^Detach from/ });
    await dialog.getByLabel('Reason', { exact: true }).fill(reason);
    await dialog.getByRole('button', { name: 'Detach', exact: true }).click();
  }
}

/** @param {string} value */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { VendorDetailPage };
