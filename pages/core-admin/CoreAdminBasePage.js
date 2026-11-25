// @ts-check
const { BasePage } = require('../base/BasePage');

/**
 * Shared left-sidebar chrome for the core platform admin console,
 * confirmed live (2026-11-25) **under Playwright itself** (a real,
 * non-automated browser session's own accessibility reader had
 * misreported this next fact as a `link` role — Playwright's strict,
 * CDP-backed computation corrected it): each top-level group
 * ("Merchant Integration", "Charge & Rate Config", "EMI Setting", ...)
 * is an `<a>` tag with **no `href`**, so its real ARIA role is
 * `generic`, not `link` — only its expanded children (Merchant Type,
 * Merchant List, ...) are true `<a href>` links. The group triggers are
 * therefore targeted by their visible text, not by role, while the
 * children keep `getByRole('link', ...)`. Same overall shape as
 * merchant-dev's "Merchant Management" group in `AdminBasePage.js`.
 */
class CoreAdminBasePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.merchantIntegrationGroup = page.getByText('Merchant Integration', { exact: true });
    this.merchantTypeLink = page.getByRole('link', { name: 'Merchant Type' });
    this.merchantListLink = page.getByRole('link', { name: 'Merchant List' });

    this.chargeRateConfigGroup = page.getByText('Charge & Rate Config', { exact: true });
    this.merchantChargeMappingLink = page.getByRole('link', { name: 'Merchant Charge Mapping' });
    this.paymentInstrumentChargeLink = page.getByRole('link', { name: 'Payment Instrument Charge' });
    this.discountRatesLink = page.getByRole('link', { name: 'Discount Rates' });
    this.discountAssignmentLink = page.getByRole('link', { name: 'Discount Assignment' });

    this.emiSettingGroup = page.getByText('EMI Setting', { exact: true });
    this.emiConfigurationLink = page.getByRole('link', { name: 'EMI Configuration' });
    this.emiActivationLink = page.getByRole('link', { name: 'EMI Activation' });
    this.emiSupportedBankLink = page.getByRole('link', { name: 'EMI Supported Bank' });

    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  async goToMerchantType() {
    if (!(await this.merchantTypeLink.isVisible())) {
      await this.merchantIntegrationGroup.click();
    }
    await this.merchantTypeLink.click();
  }

  async goToMerchantList() {
    if (!(await this.merchantListLink.isVisible())) {
      await this.merchantIntegrationGroup.click();
    }
    await this.merchantListLink.click();
  }

  async goToMerchantChargeMapping() {
    if (!(await this.merchantChargeMappingLink.isVisible())) {
      await this.chargeRateConfigGroup.click();
    }
    await this.merchantChargeMappingLink.click();
  }

  async goToPaymentInstrumentCharge() {
    if (!(await this.paymentInstrumentChargeLink.isVisible())) {
      await this.chargeRateConfigGroup.click();
    }
    await this.paymentInstrumentChargeLink.click();
  }

  async goToDiscountRates() {
    if (!(await this.discountRatesLink.isVisible())) {
      await this.chargeRateConfigGroup.click();
    }
    await this.discountRatesLink.click();
  }

  async goToDiscountAssignment() {
    if (!(await this.discountAssignmentLink.isVisible())) {
      await this.chargeRateConfigGroup.click();
    }
    await this.discountAssignmentLink.click();
  }

  async goToEmiConfiguration() {
    if (!(await this.emiConfigurationLink.isVisible())) {
      await this.emiSettingGroup.click();
    }
    await this.emiConfigurationLink.click();
  }

  async goToEmiActivation() {
    if (!(await this.emiActivationLink.isVisible())) {
      await this.emiSettingGroup.click();
    }
    await this.emiActivationLink.click();
  }

  async goToEmiSupportedBank() {
    if (!(await this.emiSupportedBankLink.isVisible())) {
      await this.emiSettingGroup.click();
    }
    await this.emiSupportedBankLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}

module.exports = { CoreAdminBasePage };
