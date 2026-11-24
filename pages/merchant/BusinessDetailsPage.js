// @ts-check
const { MerchantBasePage } = require('./MerchantBasePage');

/**
 * Step 4 of 8 — "Business Details": classifies the organization. All four
 * fields are native `<select>`s with stable `value=` codes (confirmed
 * live against merchant-dev, 2026-11-24). A "Legal Documentation" region
 * exists in the DOM but renders no fields for Business Type = Sole Trader;
 * other business types may require additional documents there — unverified.
 */
class BusinessDetailsPage extends MerchantBasePage {
  static BUSINESS_TYPES = {
    soleTrader: 'sole-trader',
    privateLimited: 'private-limited',
    publicLimited: 'public-limited',
    ngo: 'ngo',
    governmentEntity: 'government-entity',
    cooperative: 'cooperative',
  };

  static SECTOR_TYPES = {
    private: 'private',
    public: 'public',
    ngoSector: 'ngo-sector',
    semiGovernment: 'semi-government',
  };

  static BUSINESS_CATEGORIES = {
    retail: 'retail',
    hospitality: 'hospitality',
    utilities: 'utilities',
    education: 'education',
    healthcare: 'healthcare',
    transport: 'transport',
    financialServices: 'financial-services',
    governmentServices: 'government-services',
  };

  static SERVICE_TYPES = {
    goods: 'goods',
    services: 'services',
    utilityBills: 'utility-bills',
    donations: 'donations',
    subscriptions: 'subscriptions',
  };

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, MerchantBasePage.STEP_LABELS[3]);

    this.businessTypeSelect = page.getByLabel('Business Type', { exact: true });
    this.sectorTypeSelect = page.getByLabel('Sector Type', { exact: true });
    this.businessCategorySelect = page.getByLabel('Business Category', { exact: true });
    this.serviceTypeSelect = page.getByLabel('Service Type', { exact: true });
  }

  /**
   * @param {{businessType: string, sectorType: string, businessCategory: string, serviceType: string}} details
   * Values are the `value=` codes from the static maps above, e.g. BusinessDetailsPage.BUSINESS_TYPES.soleTrader.
   */
  async fillBusinessDetails(details) {
    await this.businessTypeSelect.selectOption(details.businessType);
    await this.sectorTypeSelect.selectOption(details.sectorType);
    await this.businessCategorySelect.selectOption(details.businessCategory);
    await this.serviceTypeSelect.selectOption(details.serviceType);
  }
}

module.exports = { BusinessDetailsPage };
