// @ts-check
const base = require('@playwright/test');
const { AdminLoginPage } = require('../pages/admin/AdminLoginPage');
const { ApplicationsListPage } = require('../pages/admin/ApplicationsListPage');
const { ApplicationDetailsDialog } = require('../pages/admin/ApplicationDetailsDialog');
const { ApproveMerchantDialog } = require('../pages/admin/ApproveMerchantDialog');
const { RejectMerchantDialog } = require('../pages/admin/RejectMerchantDialog');
const { ApiSecretsDialog } = require('../pages/admin/ApiSecretsDialog');
const { MerchantPricingPage } = require('../pages/admin/MerchantPricingPage');
const { RateCataloguePage } = require('../pages/admin/RateCataloguePage');
const { SuperMerchantPricingCheckDialog } = require('../pages/admin/SuperMerchantPricingCheckDialog');
const { SuperMerchantHierarchyDialog } = require('../pages/admin/SuperMerchantHierarchyDialog');
const { VendorsOtherChargeDialog } = require('../pages/admin/VendorsOtherChargeDialog');
const { EditCorePlatformDialog } = require('../pages/admin/EditCorePlatformDialog');
const { DisableOnCorePlatformDialog } = require('../pages/admin/DisableOnCorePlatformDialog');
const { VendorsListPage } = require('../pages/admin/VendorsListPage');
const { VendorWizardPersonalInfoStep } = require('../pages/admin/VendorWizardPersonalInfoStep');
const { VendorWizardBusinessInfoStep } = require('../pages/admin/VendorWizardBusinessInfoStep');
const { VendorWizardPrimaryContactStep } = require('../pages/admin/VendorWizardPrimaryContactStep');
const { VendorWizardBankDetailsStep } = require('../pages/admin/VendorWizardBankDetailsStep');
const { VendorDetailPage } = require('../pages/admin/VendorDetailPage');

/**
 * Custom fixtures for the Admin Console suite.
 *
 * @typedef {object} AdminFixtures
 * @property {AdminLoginPage} adminLoginPage
 * @property {ApplicationsListPage} applicationsListPage
 * @property {ApplicationDetailsDialog} applicationDetailsDialog
 * @property {ApproveMerchantDialog} approveMerchantDialog
 * @property {RejectMerchantDialog} rejectMerchantDialog
 * @property {ApiSecretsDialog} apiSecretsDialog
 * @property {MerchantPricingPage} merchantPricingPage
 * @property {RateCataloguePage} rateCataloguePage
 * @property {SuperMerchantPricingCheckDialog} superMerchantPricingCheckDialog
 * @property {SuperMerchantHierarchyDialog} superMerchantHierarchyDialog
 * @property {VendorsOtherChargeDialog} vendorsOtherChargeDialog
 * @property {EditCorePlatformDialog} editCorePlatformDialog
 * @property {DisableOnCorePlatformDialog} disableOnCorePlatformDialog
 * @property {VendorsListPage} vendorsListPage
 * @property {VendorWizardPersonalInfoStep} vendorPersonalInfoStep
 * @property {VendorWizardBusinessInfoStep} vendorBusinessInfoStep
 * @property {VendorWizardPrimaryContactStep} vendorPrimaryContactStep
 * @property {VendorWizardBankDetailsStep} vendorBankDetailsStep
 * @property {VendorDetailPage} vendorDetailPage
 */

const test = base.test.extend({
  adminLoginPage: async ({ page }, use) => {
    const adminLoginPage = new AdminLoginPage(page);
    await adminLoginPage.open();
    await use(adminLoginPage);
  },

  applicationsListPage: async ({ page }, use) => {
    await use(new ApplicationsListPage(page));
  },

  applicationDetailsDialog: async ({ page }, use) => {
    await use(new ApplicationDetailsDialog(page));
  },

  approveMerchantDialog: async ({ page }, use) => {
    await use(new ApproveMerchantDialog(page));
  },

  rejectMerchantDialog: async ({ page }, use) => {
    await use(new RejectMerchantDialog(page));
  },

  apiSecretsDialog: async ({ page }, use) => {
    await use(new ApiSecretsDialog(page));
  },

  merchantPricingPage: async ({ page }, use) => {
    await use(new MerchantPricingPage(page));
  },

  rateCataloguePage: async ({ page }, use) => {
    await use(new RateCataloguePage(page));
  },

  superMerchantPricingCheckDialog: async ({ page }, use) => {
    await use(new SuperMerchantPricingCheckDialog(page));
  },

  superMerchantHierarchyDialog: async ({ page }, use) => {
    await use(new SuperMerchantHierarchyDialog(page));
  },

  vendorsOtherChargeDialog: async ({ page }, use) => {
    await use(new VendorsOtherChargeDialog(page));
  },

  editCorePlatformDialog: async ({ page }, use) => {
    await use(new EditCorePlatformDialog(page));
  },

  disableOnCorePlatformDialog: async ({ page }, use) => {
    await use(new DisableOnCorePlatformDialog(page));
  },

  vendorsListPage: async ({ page }, use) => {
    await use(new VendorsListPage(page));
  },

  vendorPersonalInfoStep: async ({ page }, use) => {
    await use(new VendorWizardPersonalInfoStep(page));
  },

  vendorBusinessInfoStep: async ({ page }, use) => {
    await use(new VendorWizardBusinessInfoStep(page));
  },

  vendorPrimaryContactStep: async ({ page }, use) => {
    await use(new VendorWizardPrimaryContactStep(page));
  },

  vendorBankDetailsStep: async ({ page }, use) => {
    await use(new VendorWizardBankDetailsStep(page));
  },

  vendorDetailPage: async ({ page }, use) => {
    await use(new VendorDetailPage(page));
  },
});

module.exports = { test, expect: base.expect };
