// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * Shared behaviour for the 4-step Vendor wizard (`/admin/vendors/:id`
 * while the vendor is a Draft): Personal Information, Business
 * Information, Primary Contact and Bank Details. Confirmed live against
 * merchant-dev (2026-11-25): all four steps render on one URL (an SPA
 * step switcher, not separate pages), share the same left-hand "Steps"
 * nav (`N. {label}`, one button per step) and the same footer — "Save
 * draft" (type=button) plus a type=submit button whose label is
 * "Save & continue" on steps 1–3 and "Save & submit for approval" only
 * on step 4 (saving the last step submits the vendor for admin review).
 */
class VendorWizardBasePage extends BasePage {
  static STEP_LABELS = ['Personal Information', 'Business Information', 'Primary Contact', 'Bank Details'];

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.vendorHeading = page.getByRole('heading', { name: /^VND-\d+/ });
    this.stepNav = page.getByRole('navigation', { name: 'Steps' });
    this.saveDraftButton = page.getByRole('button', { name: 'Save draft' });
    // Matches both "Save & continue" (steps 1-3) and "Save & submit for
    // approval" (step 4) — the only type=submit button on any step.
    this.nextButton = page.locator('button[type="submit"]');
  }

  /** @param {string} stepLabel One of VendorWizardBasePage.STEP_LABELS */
  getStepNavButton(stepLabel) {
    return this.stepNav.getByRole('button', { name: new RegExp(`\\d\\. ${stepLabel}$`) });
  }

  async saveDraft() {
    await this.saveDraftButton.click();
  }

  /** Clicks "Save & continue" / "Save & submit for approval". */
  async goToNextStep() {
    await this.nextButton.click();
  }
}

module.exports = { VendorWizardBasePage };
