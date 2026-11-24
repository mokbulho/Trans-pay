// @ts-check
const { AdminBasePage } = require('./AdminBasePage');

/**
 * Merchant Management → Applications (`/admin/merchants`). Confirmed live
 * against merchant-dev (2026-11-24): defaults to the "Pending review" tab.
 * Each row exposes a "⋮" button named "Actions for {merchant name}" with a
 * menu of View application / Approve / Reject (Pending tab only — the
 * Approved tab instead shows a per-row "Pricing" link, whose visible text
 * is "Pricing" but whose accessible name is a long descriptive label, so
 * it's targeted by its `/pricing` href instead of by name).
 */
class ApplicationsListPage extends AdminBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Merchant Approval' });
    this.allMerchantsTab = page.getByRole('button', { name: 'All merchants' });
    this.pendingReviewTab = page.getByRole('button', { name: 'Pending review' });
    this.approvedTab = page.getByRole('button', { name: 'Approved' });
    this.searchInput = page.getByPlaceholder('Search merchant, code or district');
  }

  async open() {
    await this.page.goto('/admin/merchants');
  }

  /** @param {string} merchantName */
  getRow(merchantName) {
    return this.page.getByRole('row', { name: new RegExp(escapeRegExp(merchantName)) });
  }

  /** @param {string} query */
  async search(query) {
    await this.searchInput.fill(query);
  }

  /** @param {string} merchantName */
  async openRowActions(merchantName) {
    await this.page.getByRole('button', { name: `Actions for ${merchantName}`, exact: true }).click();
  }

  /** Call after openRowActions(). */
  async clickViewApplication() {
    await this.page.getByRole('menuitem', { name: 'View application' }).click();
  }

  /** Call after openRowActions(). Opens the same approve form as ApplicationDetailsDialog's button. */
  async clickApproveFromMenu() {
    await this.page.getByRole('menuitem', { name: 'Approve' }).click();
  }

  /** Call after openRowActions(). */
  async clickRejectFromMenu() {
    await this.page.getByRole('menuitem', { name: 'Reject' }).click();
  }

  /**
   * Reads the status chip text ("Pending" | "Active" | "Rejected") out of
   * a merchant's row. Search for the merchant first if it isn't on the
   * current page/tab.
   * @param {string} merchantName
   */
  async getStatus(merchantName) {
    const text = await this.getRow(merchantName).innerText();
    return text.match(/\b(Pending|Active|Rejected)\b/)?.[1] ?? null;
  }

  /** Approved tab only. @param {string} merchantName */
  getPricingLink(merchantName) {
    return this.getRow(merchantName).locator('a[href*="/pricing"]');
  }
}

/** @param {string} value */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { ApplicationsListPage };
