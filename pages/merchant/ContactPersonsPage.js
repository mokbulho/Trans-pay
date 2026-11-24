// @ts-check
const { MerchantBasePage } = require('./MerchantBasePage');

/**
 * Step 6 of 8 — "Contact Persons". Confirmed live against merchant-dev
 * (2026-11-24): this is an accordion, not a repeatable list. "Primary
 * Contact*" is expanded and required by default with Full Name,
 * Designation, Email Address, Mobile Number and Alternative Mobile
 * Number. "Finance Contact", "Technology Contact" and "Other Contact"
 * are collapsed, explicitly labelled "Optional", and their field shape
 * was not inspected (left as TODO below) — only expand them if a test
 * actually needs to cover that path.
 */
class ContactPersonsPage extends MerchantBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, MerchantBasePage.STEP_LABELS[5]);

    this.primaryContactHeading = page.getByRole('heading', { name: 'Primary Contact' });
    this.fullNameInput = page.getByLabel('Full Name', { exact: true });
    this.designationInput = page.getByLabel('Designation', { exact: true });
    this.emailInput = page.getByLabel('Email Address', { exact: true });
    this.mobileNumberInput = page.getByLabel('Mobile Number', { exact: true });
    this.alternativeMobileNumberInput = page.getByLabel('Alternative Mobile Number', { exact: true });

    this.financeContactToggle = page.getByRole('button', { name: /Finance Contact/ });
    this.technologyContactToggle = page.getByRole('button', { name: /Technology Contact/ });
    this.otherContactToggle = page.getByRole('button', { name: /Other Contact/ });
  }

  /**
   * @param {{name: string, designation: string, email: string, mobile: string, alternativeMobile?: string}} contact
   */
  async fillPrimaryContact(contact) {
    await this.fullNameInput.fill(contact.name);
    await this.designationInput.fill(contact.designation);
    await this.emailInput.fill(contact.email);
    await this.mobileNumberInput.fill(contact.mobile);
    if (contact.alternativeMobile) {
      await this.alternativeMobileNumberInput.fill(contact.alternativeMobile);
    }
  }

  // TODO: unverified — expand and inspect before filling. Left as
  // navigation-only helpers since the optional sections weren't opened
  // during exploration.
  async expandFinanceContact() {
    await this.financeContactToggle.click();
  }

  async expandTechnologyContact() {
    await this.technologyContactToggle.click();
  }

  async expandOtherContact() {
    await this.otherContactToggle.click();
  }
}

module.exports = { ContactPersonsPage };
