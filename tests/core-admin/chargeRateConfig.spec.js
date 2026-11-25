// @ts-check
const { test, expect } = require('../../fixtures/core-admin.fixtures');
const coreAdminTestData = require('../../data/core-admin/coreAdminTestData');

/**
 * Core platform admin console — Charge & Rate Config (Merchant Charge
 * Mapping, Payment Instrument Charge, Discount Rates, Discount
 * Assignment). Confirmed live (2026-11-25). Every dialog opened here
 * is read-only in this suite — always Cancel/Close, never Update — so
 * repeated runs never mutate real platform data.
 */
test.describe('Core admin — Charge & Rate Config', () => {
  test('Merchant Charge Mapping shows Aalo\'s confirmed 0.5% Transpay charge @smoke', async ({
    coreAdminLoginPage,
    merchantChargeMappingPage,
    merchantChargeMappingEditDialog,
  }) => {
    await coreAdminLoginPage.login();
    await merchantChargeMappingPage.goToMerchantChargeMapping();
    await merchantChargeMappingPage.filter(coreAdminTestData.aalo.merchantUserId);

    const row = merchantChargeMappingPage.getRow(coreAdminTestData.aalo.merchantUserId);
    await expect(row).toContainText(coreAdminTestData.aaloChargeMapping.configurationType);
    await expect(row).toContainText(coreAdminTestData.aaloChargeMapping.chargeType);

    await merchantChargeMappingPage.clickEdit(coreAdminTestData.aalo.merchantUserId);
    await expect(merchantChargeMappingEditDialog.heading).toBeVisible();
    await expect(merchantChargeMappingEditDialog.chargeAmountInput).toHaveValue(
      coreAdminTestData.aaloChargeMapping.chargeAmount
    );
    await merchantChargeMappingEditDialog.cancel();
  });

  test('Payment Instrument Charge confirms TP_SANDBOX_PG\'s Actual Rate 1 / Rate To Charge 1.5', async ({
    coreAdminLoginPage,
    paymentInstrumentChargePage,
    paymentInstrumentChargeEditDialog,
  }) => {
    await coreAdminLoginPage.login();
    await paymentInstrumentChargePage.goToPaymentInstrumentCharge();
    await paymentInstrumentChargePage.filter('sandbox');
    await paymentInstrumentChargePage.clickEditView();

    await expect(paymentInstrumentChargeEditDialog.actualRateInput).toHaveValue(
      coreAdminTestData.tpSandboxPgRate.actualRate
    );
    await expect(paymentInstrumentChargeEditDialog.rateToChargeInput).toHaveValue(
      coreAdminTestData.tpSandboxPgRate.rateToCharge
    );
    await expect(paymentInstrumentChargeEditDialog.bankPercentageTakenOnSelect).toHaveValue(/BILL_CHARGES_MARGIN/);
    await expect(paymentInstrumentChargeEditDialog.applicableFromInput).toHaveValue(
      coreAdminTestData.tpSandboxPgRate.applicableFrom
    );
    await expect(paymentInstrumentChargeEditDialog.applicableToInput).toHaveValue(
      coreAdminTestData.tpSandboxPgRate.applicableTo
    );

    await paymentInstrumentChargeEditDialog.cancel();
  });

  test('Discount Rates lists the platform\'s discount campaigns', async ({ coreAdminLoginPage, discountRatesPage }) => {
    await coreAdminLoginPage.login();
    await discountRatesPage.goToDiscountRates();

    await expect(discountRatesPage.heading).toBeVisible();
    await discountRatesPage.filter('Eid al-Adha');
    await expect(discountRatesPage.page.getByRole('row', { name: /Eid al-Adha/ })).toContainText('PERCENTAGE');
  });

  test('Discount Assignment links a discount to a Transpay ID, always scoped ALLMERCHANT', async ({
    coreAdminLoginPage,
    discountAssignmentPage,
  }) => {
    await coreAdminLoginPage.login();
    await discountAssignmentPage.goToDiscountAssignment();

    await expect(discountAssignmentPage.heading).toBeVisible();
    // Confirmed live: every row's User Type is ALLMERCHANT — none target
    // a single merchant individually.
    await expect(discountAssignmentPage.page.getByRole('row').filter({ hasText: 'ALLMERCHANT' }).first()).toBeVisible();
  });
});
