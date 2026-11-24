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
});

module.exports = { test, expect: base.expect };
