// @ts-check

/**
 * "Manage {merchant} on the core platform" dialog, opened from a
 * merchant row's "Edit on the core platform" menu item. Confirmed live
 * (2026-11-24): a Profile section (business name, email, address,
 * domain — each saved together via "Save profile"), an Allowed IPs
 * whole-list replace, and a Bank details section, plus a History tab
 * showing every portal-made change as a before → after diff
 * ("Secrets are never recorded").
 */
class EditCorePlatformDialog {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Dialog's accessible name is dynamic: "Manage {merchant} on the core platform".
    this.dialog = page.getByRole('dialog', { name: /^Manage .+ on the core platform/ });
    this.editTab = this.dialog.getByRole('button', { name: 'Edit', exact: true });
    this.historyTab = this.dialog.getByRole('button', { name: 'History', exact: true });

    this.businessNameInput = this.dialog.getByLabel('Business name');
    this.emailInput = this.dialog.getByLabel('Email');
    this.addressInput = this.dialog.getByLabel('Address');
    this.domainInput = this.dialog.getByLabel('Domain');
    this.saveProfileButton = this.dialog.getByRole('button', { name: 'Save profile' });
    this.profileUpdatedMessage = this.dialog.getByText('Profile updated on the core platform.');

    this.replaceAllowedIpsButton = this.dialog.getByRole('button', { name: 'Replace allowed IPs' });

    // "Bank name" <select> has no `for`-linked label (confirmed live),
    // same pattern as the Merchant Pricing form's "Kind" select.
    this.bankNameSelect = this.dialog
      .locator('label', { hasText: 'Bank name' })
      .locator('xpath=following-sibling::div[1]//select');
    this.saveBankDetailsButton = this.dialog.getByRole('button', { name: 'Save bank details' });

    // Two "Close" buttons exist (header icon + footer text).
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' }).last();
  }

  /**
   * @param {string} value
   * @returns {Promise<void>}
   */
  async setAddress(value) {
    await this.addressInput.fill(value);
    await this.saveProfileButton.click();
  }

  async close() {
    await this.closeButton.click();
  }
}

module.exports = { EditCorePlatformDialog };
