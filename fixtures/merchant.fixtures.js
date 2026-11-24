// @ts-check
const base = require('@playwright/test');
const { HomePage } = require('../pages/merchant/HomePage');
const { VerifyMobileOtpPage } = require('../pages/merchant/VerifyMobileOtpPage');
const { MerchantTypePage } = require('../pages/merchant/MerchantTypePage');
const { PersonalInformationPage } = require('../pages/merchant/PersonalInformationPage');
const { BusinessInformationPage } = require('../pages/merchant/BusinessInformationPage');
const { BusinessDetailsPage } = require('../pages/merchant/BusinessDetailsPage');
const { BusinessSupportDetailsPage } = require('../pages/merchant/BusinessSupportDetailsPage');
const { ContactPersonsPage } = require('../pages/merchant/ContactPersonsPage');
const { BankDetailsPage } = require('../pages/merchant/BankDetailsPage');
const { ReviewRegistrationPage } = require('../pages/merchant/ReviewRegistrationPage');
const { ApplicationStatusPage } = require('../pages/merchant/ApplicationStatusPage');

/**
 * Custom fixtures for the Merchant Onboarding suite — one page object per
 * wizard step, auto-constructed against the test's `page`. Add new steps
 * here as the flow grows instead of `new`-ing page objects in every spec.
 *
 * @typedef {object} MerchantFixtures
 * @property {HomePage} homePage
 * @property {VerifyMobileOtpPage} verifyMobileOtpPage
 * @property {MerchantTypePage} merchantTypePage
 * @property {PersonalInformationPage} personalInformationPage
 * @property {BusinessInformationPage} businessInformationPage
 * @property {BusinessDetailsPage} businessDetailsPage
 * @property {BusinessSupportDetailsPage} businessSupportDetailsPage
 * @property {ContactPersonsPage} contactPersonsPage
 * @property {BankDetailsPage} bankDetailsPage
 * @property {ReviewRegistrationPage} reviewRegistrationPage
 * @property {ApplicationStatusPage} applicationStatusPage
 */

const test = base.test.extend({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await use(homePage);
  },

  verifyMobileOtpPage: async ({ page }, use) => {
    await use(new VerifyMobileOtpPage(page));
  },

  merchantTypePage: async ({ page }, use) => {
    await use(new MerchantTypePage(page));
  },

  personalInformationPage: async ({ page }, use) => {
    await use(new PersonalInformationPage(page));
  },

  businessInformationPage: async ({ page }, use) => {
    await use(new BusinessInformationPage(page));
  },

  businessDetailsPage: async ({ page }, use) => {
    await use(new BusinessDetailsPage(page));
  },

  businessSupportDetailsPage: async ({ page }, use) => {
    await use(new BusinessSupportDetailsPage(page));
  },

  contactPersonsPage: async ({ page }, use) => {
    await use(new ContactPersonsPage(page));
  },

  bankDetailsPage: async ({ page }, use) => {
    await use(new BankDetailsPage(page));
  },

  reviewRegistrationPage: async ({ page }, use) => {
    await use(new ReviewRegistrationPage(page));
  },

  applicationStatusPage: async ({ page }, use) => {
    await use(new ApplicationStatusPage(page));
  },
});

module.exports = { test, expect: base.expect };
