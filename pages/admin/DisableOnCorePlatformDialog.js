// @ts-check

/**
 * Confirmation dialog for "Disable on the core platform". Confirmed live
 * (2026-11-24) — and worth flagging: the row menu's own description says
 * "Stop the merchant taking payments. Nothing is deleted and it can be
 * re-enabled," but the confirmation dialog itself is titled "Reject this
 * merchant on the core platform?" and warns the merchant "will not be
 * able to authenticate until re-approved" — stronger language than the
 * menu copy suggests. This framework only opens and asserts on this
 * dialog; it never confirms it, to avoid taking a merchant out of
 * service (and potentially needing re-approval) as a side effect of a
 * test run — see README "Charge distribution" / merchant lifecycle notes.
 */
class DisableOnCorePlatformDialog {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.dialog = page.getByRole('dialog', { name: 'Reject this merchant on the core platform?' });
    this.rejectButton = this.dialog.getByRole('button', { name: 'Reject', exact: true });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
  }

  async cancel() {
    await this.cancelButton.click();
  }
}

module.exports = { DisableOnCorePlatformDialog };
