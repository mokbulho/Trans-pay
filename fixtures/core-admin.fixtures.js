// @ts-check
const base = require('@playwright/test');
const { CoreAdminLoginPage } = require('../pages/core-admin/CoreAdminLoginPage');
const { MerchantTypePage } = require('../pages/core-admin/MerchantTypePage');
const { CoreMerchantListPage } = require('../pages/core-admin/CoreMerchantListPage');
const { EditMerchantDetailsDialog } = require('../pages/core-admin/EditMerchantDetailsDialog');
const { BankDetailsDialog } = require('../pages/core-admin/BankDetailsDialog');
const { AppearanceSettingsDialog } = require('../pages/core-admin/AppearanceSettingsDialog');
const { ResetApiSecretDialog } = require('../pages/core-admin/ResetApiSecretDialog');
const { AssignInstrumentPage } = require('../pages/core-admin/AssignInstrumentPage');
const { MerchantChargeMappingPage } = require('../pages/core-admin/MerchantChargeMappingPage');
const { MerchantChargeMappingEditDialog } = require('../pages/core-admin/MerchantChargeMappingEditDialog');
const { PaymentInstrumentChargePage } = require('../pages/core-admin/PaymentInstrumentChargePage');
const { PaymentInstrumentChargeEditDialog } = require('../pages/core-admin/PaymentInstrumentChargeEditDialog');
const { DiscountRatesPage } = require('../pages/core-admin/DiscountRatesPage');
const { DiscountRateDetailPage } = require('../pages/core-admin/DiscountRateDetailPage');
const { DiscountAssignmentPage } = require('../pages/core-admin/DiscountAssignmentPage');
const { DiscountAssignmentDetailDialog } = require('../pages/core-admin/DiscountAssignmentDetailDialog');
const { EmiConfigurationPage } = require('../pages/core-admin/EmiConfigurationPage');
const { EmiActivationPage } = require('../pages/core-admin/EmiActivationPage');
const { EmiSupportedBankPage } = require('../pages/core-admin/EmiSupportedBankPage');

/**
 * Custom fixtures for the core platform admin console
 * (admin.dev.transpay.com.bd) — a separate site from merchant-dev's own
 * Admin Console, so these fixtures are independent of `admin.fixtures.js`.
 *
 * @typedef {object} CoreAdminFixtures
 * @property {CoreAdminLoginPage} coreAdminLoginPage
 * @property {MerchantTypePage} merchantTypePage
 * @property {CoreMerchantListPage} coreMerchantListPage
 * @property {EditMerchantDetailsDialog} editMerchantDetailsDialog
 * @property {BankDetailsDialog} bankDetailsDialog
 * @property {AppearanceSettingsDialog} appearanceSettingsDialog
 * @property {ResetApiSecretDialog} resetApiSecretDialog
 * @property {AssignInstrumentPage} assignInstrumentPage
 * @property {MerchantChargeMappingPage} merchantChargeMappingPage
 * @property {MerchantChargeMappingEditDialog} merchantChargeMappingEditDialog
 * @property {PaymentInstrumentChargePage} paymentInstrumentChargePage
 * @property {PaymentInstrumentChargeEditDialog} paymentInstrumentChargeEditDialog
 * @property {DiscountRatesPage} discountRatesPage
 * @property {DiscountRateDetailPage} discountRateDetailPage
 * @property {DiscountAssignmentPage} discountAssignmentPage
 * @property {DiscountAssignmentDetailDialog} discountAssignmentDetailDialog
 * @property {EmiConfigurationPage} emiConfigurationPage
 * @property {EmiActivationPage} emiActivationPage
 * @property {EmiSupportedBankPage} emiSupportedBankPage
 */

const test = base.test.extend({
  coreAdminLoginPage: async ({ page }, use) => {
    const coreAdminLoginPage = new CoreAdminLoginPage(page);
    await coreAdminLoginPage.open();
    await use(coreAdminLoginPage);
  },

  merchantTypePage: async ({ page }, use) => {
    await use(new MerchantTypePage(page));
  },

  coreMerchantListPage: async ({ page }, use) => {
    await use(new CoreMerchantListPage(page));
  },

  editMerchantDetailsDialog: async ({ page }, use) => {
    await use(new EditMerchantDetailsDialog(page));
  },

  bankDetailsDialog: async ({ page }, use) => {
    await use(new BankDetailsDialog(page));
  },

  appearanceSettingsDialog: async ({ page }, use) => {
    await use(new AppearanceSettingsDialog(page));
  },

  resetApiSecretDialog: async ({ page }, use) => {
    await use(new ResetApiSecretDialog(page));
  },

  assignInstrumentPage: async ({ page }, use) => {
    await use(new AssignInstrumentPage(page));
  },

  merchantChargeMappingPage: async ({ page }, use) => {
    await use(new MerchantChargeMappingPage(page));
  },

  merchantChargeMappingEditDialog: async ({ page }, use) => {
    await use(new MerchantChargeMappingEditDialog(page));
  },

  paymentInstrumentChargePage: async ({ page }, use) => {
    await use(new PaymentInstrumentChargePage(page));
  },

  paymentInstrumentChargeEditDialog: async ({ page }, use) => {
    await use(new PaymentInstrumentChargeEditDialog(page));
  },

  discountRatesPage: async ({ page }, use) => {
    await use(new DiscountRatesPage(page));
  },

  discountRateDetailPage: async ({ page }, use) => {
    await use(new DiscountRateDetailPage(page));
  },

  discountAssignmentPage: async ({ page }, use) => {
    await use(new DiscountAssignmentPage(page));
  },

  discountAssignmentDetailDialog: async ({ page }, use) => {
    await use(new DiscountAssignmentDetailDialog(page));
  },

  emiConfigurationPage: async ({ page }, use) => {
    await use(new EmiConfigurationPage(page));
  },

  emiActivationPage: async ({ page }, use) => {
    await use(new EmiActivationPage(page));
  },

  emiSupportedBankPage: async ({ page }, use) => {
    await use(new EmiSupportedBankPage(page));
  },
});

module.exports = { test, expect: base.expect };
