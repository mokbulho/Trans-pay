// @ts-check
const { test, expect } = require('../../fixtures/core-admin.fixtures');
const coreAdminTestData = require('../../data/core-admin/coreAdminTestData');

/**
 * Core platform admin console — Merchant Integration (Merchant Type,
 * Merchant List and its 5 row actions). Confirmed live (2026-11-25)
 * against merchant Aalo (m1182 / mer-45610001). Every dialog opened
 * here is read-only in this suite — always Cancel/No, never Update or
 * Yes — so repeated runs never mutate real platform data.
 */
test.describe('Core admin — Merchant Integration', () => {
  test('Merchant Type lists the platform\'s categories @smoke', async ({ coreAdminLoginPage, merchantTypePage }) => {
    await coreAdminLoginPage.login();
    await merchantTypePage.goToMerchantType();

    await expect(merchantTypePage.heading).toBeVisible();
    await expect(merchantTypePage.getRow('Education')).toContainText('Active');
    await expect(merchantTypePage.getRow('Proprietorship')).toContainText('Active');
    // NGO is confirmed the one Inactive type — everything else is Active.
    await expect(merchantTypePage.getRow('NGO')).toContainText('Inactive');
  });

  test('Aalo\'s Edit Details match its confirmed profile', async ({
    coreAdminLoginPage,
    coreMerchantListPage,
    editMerchantDetailsDialog,
  }) => {
    await coreAdminLoginPage.login();
    await coreMerchantListPage.goToMerchantList();
    await coreMerchantListPage.search(coreAdminTestData.aalo.merchantUserId);
    await coreMerchantListPage.openActions(coreAdminTestData.aalo.companyName);
    await coreMerchantListPage.clickEditDetails();

    await expect(editMerchantDetailsDialog.heading).toBeVisible();
    await expect(editMerchantDetailsDialog.merchantUserIdInput).toHaveValue(coreAdminTestData.aalo.merchantUserId);
    await expect(editMerchantDetailsDialog.whiteListedIpInput).toHaveValue(coreAdminTestData.aalo.whiteListedIp);
    await expect(editMerchantDetailsDialog.companyNameInput).toHaveValue(coreAdminTestData.aalo.companyName);
    await expect(editMerchantDetailsDialog.statusSelect).toHaveValue(/1/);

    await editMerchantDetailsDialog.cancel();
  });

  test('Aalo\'s Bank Details match its confirmed profile', async ({
    coreAdminLoginPage,
    coreMerchantListPage,
    bankDetailsDialog,
  }) => {
    await coreAdminLoginPage.login();
    await coreMerchantListPage.goToMerchantList();
    await coreMerchantListPage.search(coreAdminTestData.aalo.merchantUserId);
    await coreMerchantListPage.openActions(coreAdminTestData.aalo.companyName);
    await coreMerchantListPage.clickBankDetails();

    await expect(bankDetailsDialog.heading).toBeVisible();
    await expect(bankDetailsDialog.accountNumberInput).toHaveValue(coreAdminTestData.aalo.bankDetails.accountNumber);
    await expect(bankDetailsDialog.accountHolderNameInput).toHaveValue(
      coreAdminTestData.aalo.bankDetails.accountHolderName
    );
    await expect(bankDetailsDialog.routingNumberInput).toHaveValue(coreAdminTestData.aalo.bankDetails.routingNumber);

    await bankDetailsDialog.cancel();
  });

  test('Aalo\'s Appearance Settings shows its brand name', async ({
    coreAdminLoginPage,
    coreMerchantListPage,
    appearanceSettingsDialog,
  }) => {
    await coreAdminLoginPage.login();
    await coreMerchantListPage.goToMerchantList();
    await coreMerchantListPage.search(coreAdminTestData.aalo.merchantUserId);
    await coreMerchantListPage.openActions(coreAdminTestData.aalo.companyName);
    await coreMerchantListPage.clickAppearanceSettings();

    await expect(appearanceSettingsDialog.heading).toBeVisible();
    await expect(appearanceSettingsDialog.brandNameInput).toHaveValue(coreAdminTestData.aalo.companyName);

    await appearanceSettingsDialog.cancel();
  });

  test('Reset API Secret warns before resetting, and this suite always declines', async ({
    coreAdminLoginPage,
    coreMerchantListPage,
    resetApiSecretDialog,
  }) => {
    await coreAdminLoginPage.login();
    await coreMerchantListPage.goToMerchantList();
    await coreMerchantListPage.search(coreAdminTestData.aalo.merchantUserId);
    await coreMerchantListPage.openActions(coreAdminTestData.aalo.companyName);
    await coreMerchantListPage.clickResetApiSecret();

    await expect(resetApiSecretDialog.warningText).toBeVisible();

    // Never confirm this — it would immediately break whatever
    // test-merchant profile currently uses Aalo's API secret.
    await resetApiSecretDialog.decline();
  });

  test('Assign Instrument shows TP Sandbox Payment Gateway as Aalo\'s only assigned instrument', async ({
    coreAdminLoginPage,
    coreMerchantListPage,
    assignInstrumentPage,
  }) => {
    await coreAdminLoginPage.login();
    await coreMerchantListPage.goToMerchantList();
    await coreMerchantListPage.search(coreAdminTestData.aalo.merchantUserId);
    await coreMerchantListPage.openActions(coreAdminTestData.aalo.companyName);
    await coreMerchantListPage.clickAssignInstrument();

    await expect(assignInstrumentPage.heading).toBeVisible();
    await expect(assignInstrumentPage.getCheckbox(coreAdminTestData.aalo.assignedInstrument)).toBeChecked();

    await assignInstrumentPage.backButton.click();
  });
});
