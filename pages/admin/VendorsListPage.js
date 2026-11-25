// @ts-check
const { AdminBasePage } = require('./AdminBasePage');

/**
 * Merchant Management → Vendors (`/admin/vendors`). Confirmed live
 * against merchant-dev (2026-11-25): a tabbed list — Awaiting approval
 * (default), Drafts, Approved, Sent back, All — each tab's button shows
 * a live count badge. "+ New vendor" creates a fresh Draft and
 * redirects straight to its wizard at `/admin/vendors/:id`. Rows open
 * by clicking anywhere in them (page copy: "Click a row to open it.").
 */
class VendorsListPage extends AdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Vendors', exact: true });
    this.newVendorButton = page.getByRole('button', { name: '+ New vendor' });
    this.searchInput = page.getByPlaceholder('Reference, name or mobile');

    this.awaitingApprovalTab = page.getByRole('button', { name: /^Awaiting approval/ });
    this.draftsTab = page.getByRole('button', { name: /^Drafts/ });
    this.approvedTab = page.getByRole('button', { name: /^Approved/ });
    this.sentBackTab = page.getByRole('button', { name: /^Sent back/ });
    this.allTab = page.getByRole('button', { name: /^All/ });
  }

  async open() {
    await this.page.goto('/admin/vendors');
  }

  /** @param {string} query Reference, business name or mobile number. */
  async search(query) {
    await this.searchInput.fill(query);
  }

  /** @param {string} reference e.g. 'VND-00000003' */
  getRow(reference) {
    return this.page.getByRole('row', { name: new RegExp(reference) });
  }

  /**
   * Clicks "+ New vendor" and waits for the redirect to its wizard.
   * @returns {Promise<string>} The new vendor's reference, e.g. 'VND-00000005'.
   */
  async createNewVendor() {
    await this.newVendorButton.click();
    await this.page.waitForURL(/\/admin\/vendors\/\d+$/);
    const heading = this.page.getByRole('heading', { name: /^VND-\d+/ });
    const text = await heading.textContent();
    return (text || '').split(' ')[0].trim();
  }
}

module.exports = { VendorsListPage };
