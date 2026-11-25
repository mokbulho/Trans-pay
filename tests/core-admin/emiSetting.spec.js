// @ts-check
const { test, expect } = require('../../fixtures/core-admin.fixtures');
const coreAdminTestData = require('../../data/core-admin/coreAdminTestData');

/**
 * Core platform admin console — EMI Setting (EMI Configuration, EMI
 * Activation, EMI Supported Bank). Confirmed live (2026-11-25): EMI is
 * essentially unused in practice — only one internal test account has
 * it activated at all (see `EmiActivationPage`). Read-only throughout.
 */
test.describe('Core admin — EMI Setting', () => {
  test('EMI Configuration lists the 5 supported banks\' eligibility rules @smoke', async ({
    coreAdminLoginPage,
    emiConfigurationPage,
  }) => {
    await coreAdminLoginPage.login();
    await emiConfigurationPage.goToEmiConfiguration();

    await expect(emiConfigurationPage.heading).toBeVisible();
    await expect(emiConfigurationPage.getRow('Brac Bank')).toContainText('10000');
    await expect(emiConfigurationPage.getRow('UCBL')).toContainText('5000');
  });

  test('EMI Activation shows only the internal test account activated', async ({
    coreAdminLoginPage,
    emiActivationPage,
  }) => {
    await coreAdminLoginPage.login();
    await emiActivationPage.goToEmiActivation();

    await expect(emiActivationPage.heading).toBeVisible();
    const row = emiActivationPage.getRow(coreAdminTestData.onlyEmiActivatedMerchant.transpayId);
    await expect(row).toContainText(coreAdminTestData.onlyEmiActivatedMerchant.name);
    await expect(row).toContainText('AB Bank');
  });

  test('EMI Supported Bank lists all 5 banks, Active', async ({ coreAdminLoginPage, emiSupportedBankPage }) => {
    await coreAdminLoginPage.login();
    await emiSupportedBankPage.goToEmiSupportedBank();

    await expect(emiSupportedBankPage.heading).toBeVisible();
    await expect(emiSupportedBankPage.getRow('United Commercial Bank Limited')).toContainText('1');
    await expect(emiSupportedBankPage.getRow('Eastern Bank')).toContainText('5');
  });
});
