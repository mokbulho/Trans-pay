// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * Shared Admin Console chrome (left sidebar + top banner), confirmed live
 * against merchant-dev (2026-11-24). "Merchant Management" is a collapsible
 * nav group (a `<button>`, not a link) that must be expanded before its
 * children ("Applications", "Merchant Users", ...) are clickable.
 */
class AdminBasePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.merchantManagementNavGroup = page.getByRole('button', { name: 'Merchant Management' });
    this.applicationsNavLink = page.getByRole('link', { name: 'Applications' });
    this.vendorsNavLink = page.getByRole('link', { name: 'Vendors', exact: true });
    this.signOutButton = page.getByRole('button', { name: 'Sign out' });
    this.notificationsButton = page.getByRole('button', { name: /notifications/i });
  }

  /** Expands "Merchant Management" (if needed) and opens Applications. */
  async goToApplications() {
    if (!(await this.applicationsNavLink.isVisible())) {
      await this.merchantManagementNavGroup.click();
    }
    await this.applicationsNavLink.click();
  }

  /** Expands "Merchant Management" (if needed) and opens Vendors (`/admin/vendors`). */
  async goToVendors() {
    if (!(await this.vendorsNavLink.isVisible())) {
      await this.merchantManagementNavGroup.click();
    }
    await this.vendorsNavLink.click();
  }

  async signOut() {
    await this.signOutButton.click();
  }
}

module.exports = { AdminBasePage };
