// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * The "View application" dialog opened from a Pending row's actions menu.
 * Confirmed live against merchant-dev (2026-11-24): shows every field the
 * merchant submitted (read-only) plus an "Application PDF" download link
 * and the same Approve merchant / Reject buttons as the row's menu.
 */
class ApplicationDetailsDialog extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.dialog = page.getByRole('dialog');
    this.applicationPdfLink = page.getByRole('link', { name: 'Application PDF' });
    this.approveButton = page.getByRole('button', { name: 'Approve merchant' });
    this.rejectButton = page.getByRole('button', { name: 'Reject', exact: true });
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' });
  }

  /** @param {string} merchantName */
  heading(merchantName) {
    return this.page.getByRole('heading', { name: merchantName, exact: true });
  }

  async close() {
    await this.closeButton.click();
  }

  /**
   * Scrolls the dialog's own inner content area (not the page) from top to
   * bottom and back, visiting every submitted section and document.
   * Confirmed live: the dialog has exactly one scrollable region
   * (`.overflow-y-auto`), separate from the fixed heading/status chips.
   */
  async scrollThroughTopToBottomAndBack() {
    const scrollRegion = this.dialog.locator('.overflow-y-auto');
    await scrollRegion.hover();
    for (let i = 0; i < 8; i++) {
      await this.page.mouse.wheel(0, 400);
    }
    for (let i = 0; i < 8; i++) {
      await this.page.mouse.wheel(0, -400);
    }
  }
}

module.exports = { ApplicationDetailsDialog };
