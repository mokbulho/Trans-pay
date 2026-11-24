// @ts-check

/**
 * "Super merchant" dialog, opened from a merchant row's "Attach to a
 * super merchant" / "Change super merchant" menu item (title depends on
 * whether the merchant already has one — confirmed live, 2026-11-24).
 * Lets an approved merchant be attached under another as its sub-
 * merchant, matching the SM entity in TP_Charge_Distribution_Scenarios.
 * xlsx: once attached, the super merchant earns commission on the
 * sub-merchant's payments and its Other Charge routes to the super
 * merchant instead of the merchant itself (see VendorsOtherChargeDialog).
 */
class SuperMerchantHierarchyDialog {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.dialog = page.getByRole('dialog', { name: 'Super merchant' });
    // "Hierarchy"/"History" are plain buttons, not ARIA tabs (confirmed live).
    this.hierarchyTab = this.dialog.getByRole('button', { name: 'Hierarchy', exact: true });
    this.historyTab = this.dialog.getByRole('button', { name: 'History', exact: true });
    this.searchInput = this.dialog.getByPlaceholder('Search by name, merchant code or mobile number');
    this.reviewAttachButton = this.dialog.getByRole('button', { name: 'Review attach' });
    // Shown only when a super merchant is already attached.
    this.detachButton = this.dialog.getByRole('button', { name: /^Detach/ });
    this.changeSelectionButton = this.dialog.getByRole('button', { name: 'Change' });
    this.reasonTextarea = this.dialog.getByPlaceholder('Why is this changing? Kept on the history.');
    // "Confirm attach" or "Confirm detach" depending on which flow is active.
    this.confirmButton = this.dialog.getByRole('button', { name: /^Confirm (attach|detach)/ });
    this.backButton = this.dialog.getByRole('button', { name: 'Back' });
    // Two "Close" buttons exist (header icon + footer text) — the footer
    // one is last in DOM order, same pattern as the other admin dialogs.
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' }).last();
  }

  /** @param {string} superMerchantName Exact visible name as it appears in the search results list. */
  resultRow(superMerchantName) {
    return this.dialog.getByText(superMerchantName, { exact: true });
  }

  /**
   * Searches for and selects a super merchant candidate, then opens the
   * review step (does not submit).
   * @param {string} superMerchantName
   */
  async selectSuperMerchant(superMerchantName) {
    await this.searchInput.fill(superMerchantName);
    await this.resultRow(superMerchantName).first().click();
  }

  async close() {
    await this.closeButton.click();
  }
}

module.exports = { SuperMerchantHierarchyDialog };
