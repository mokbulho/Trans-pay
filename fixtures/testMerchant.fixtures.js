// @ts-check
const base = require('@playwright/test');
const { MerchantSettingsPage } = require('../pages/testMerchant/MerchantSettingsPage');
const { PayPage } = require('../pages/testMerchant/PayPage');
const { GatewayCheckoutPage } = require('../pages/testMerchant/GatewayCheckoutPage');
const { SandboxSimulatorPage } = require('../pages/testMerchant/SandboxSimulatorPage');
const { PaymentStatusPage } = require('../pages/testMerchant/PaymentStatusPage');

/**
 * Custom fixtures for the "Make payment" test-merchant tool suite.
 * Unlike the Admin Console and merchant onboarding wizard, none of this
 * site is behind Cloudflare Turnstile or needs a sign-in, so these tests
 * run for real under Playwright (see README "Make payment").
 *
 * @typedef {object} TestMerchantFixtures
 * @property {MerchantSettingsPage} merchantSettingsPage
 * @property {PayPage} payPage
 * @property {GatewayCheckoutPage} gatewayCheckoutPage
 * @property {SandboxSimulatorPage} sandboxSimulatorPage
 * @property {PaymentStatusPage} paymentStatusPage
 */

const test = base.test.extend({
  merchantSettingsPage: async ({ page }, use) => {
    await use(new MerchantSettingsPage(page));
  },

  payPage: async ({ page }, use) => {
    await use(new PayPage(page));
  },

  gatewayCheckoutPage: async ({ page }, use) => {
    await use(new GatewayCheckoutPage(page));
  },

  sandboxSimulatorPage: async ({ page }, use) => {
    await use(new SandboxSimulatorPage(page));
  },

  paymentStatusPage: async ({ page }, use) => {
    await use(new PaymentStatusPage(page));
  },
});

module.exports = { test, expect: base.expect };
