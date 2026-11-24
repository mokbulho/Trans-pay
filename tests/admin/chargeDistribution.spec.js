// @ts-check
const { test, expect } = require('../../fixtures/admin.fixtures');
const adminData = require('../../data/admin/adminTestData');

/**
 * Charge distribution — Admin Console → Merchant Management →
 * Rate Catalogue / a merchant's Pricing page / "Super merchant pricing
 * check". Confirmed live against merchant-dev (2026-11-24).
 *
 * This spec validates the TP_Charge_Distribution_Scenarios.xlsx business
 * rules (PI/TP/SM/M/V, see README "Charge distribution") against what the
 * platform actually implements, which is a markup/spread model rather
 * than the spreadsheet's proportional weighted split of one total
 * charge:
 *  - Condition 1 (TP always gets a share) → every merchant has a
 *    "Merchant wise rate" slot for Transpay's own cut, even when unset.
 *  - Condition 2 (PI/SM/M/V are conditional) → instruments are
 *    individually enabled (PI), a merchant may or may not be attached to
 *    a super merchant (SM) or have an "Other Charge" (V) configured, and
 *    the merchant itself always receives the remainder (M).
 *  - Condition 3 (the parts sum to the whole) → verified arithmetically
 *    against a real, fully-configured merchant's worked example below.
 *  - Condition 4 (Inbound and Outbound both apply) → the Rate Catalogue's
 *    rows are each tagged Inbound or Outbound.
 *
 * Like the rest of the Admin Console, every test logs in through the
 * real `/login` form, which is behind the same Cloudflare Turnstile
 * challenge as the merchant onboarding wizard (see adminMerchantApproval.
 * spec.js) — so each test skips itself via `blockedByCaptcha` rather than
 * failing under Playwright/CI.
 */
test.describe('Charge distribution', () => {
  test('Rate Catalogue shows the platform\'s global, read-only instrument rates @smoke', async ({
    adminLoginPage,
    rateCataloguePage,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    await rateCataloguePage.open();

    await expect(rateCataloguePage.heading).toBeVisible();
    await expect(rateCataloguePage.merchantTypeSelect).toBeVisible();
    // Confirmed live: Condition 4 — every instrument row is tagged either
    // Inbound or Outbound.
    await expect(rateCataloguePage.page.getByText('Inbound', { exact: true }).first()).toBeVisible();
  });

  test('a merchant with nothing configured shows PI/TP as not yet set (Condition 2)', async ({
    adminLoginPage,
    merchantPricingPage,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    await merchantPricingPage.open(adminData.chargeDistribution.pricingMerchantId);

    await expect(merchantPricingPage.heading(adminData.chargeDistribution.pricingMerchantName)).toBeVisible();
    await expect(merchantPricingPage.noInstrumentsEnabledMessage).toBeVisible();
    await expect(merchantPricingPage.noMerchantWiseRateMessage).toBeVisible();
    // Attached as a sub-merchant of Aalo (see merchantLifecycle.spec.js) —
    // Hierarchy is the one section that's no longer unset.
    await expect(merchantPricingPage.hierarchyNavStatus).toContainText('Under Aalo');
  });

  test('a fully configured sub-merchant\'s worked example reconciles exactly (Condition 3)', async ({
    adminLoginPage,
    merchantPricingPage,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    // Michael Madhusudan College (merchant id 88): a real sub-merchant
    // "Under Aalo" with 1 enabled instrument and a 2.00% merchant wise
    // rate + ৳10.00 Other Charge already configured — confirmed live
    // (2026-11-24), read-only here, no mutation.
    await merchantPricingPage.open(88);

    await expect(merchantPricingPage.heading('Michael Madhusudan College')).toBeVisible();
    await expect(merchantPricingPage.hierarchyNavStatus).toContainText('Under Aalo');

    const breakdown = await merchantPricingPage.readSummaryWorkedExampleBreakdown();
    const bill = breakdown['Bill'];
    const merchantWiseRateAmount = breakdown['+ Merchant wise rate (2.00%)'];
    const otherChargeAmount = breakdown['+ Other charge (৳10.00)'];
    const instrumentChargeAmount = Object.entries(breakdown).find(([label]) =>
      label.startsWith('+ TP_SANDBOX_PG')
    )?.[1];
    const payerPays = breakdown['Payer pays'];

    expect(bill).toBeGreaterThan(0);
    expect(merchantWiseRateAmount).toBeGreaterThan(0);
    expect(otherChargeAmount).toBeGreaterThan(0);
    expect(instrumentChargeAmount).toBeGreaterThan(0);
    // The parts sum to the whole — the real-world analog of the
    // spreadsheet's Condition 3 ("the sum of every party's portion must
    // equal the total charge, no more, no less").
    expect(
      Math.round((bill + merchantWiseRateAmount + otherChargeAmount + instrumentChargeAmount) * 100) / 100
    ).toBe(payerPays);
  });

  test('a negative merchant wise rate percentage is rejected (NEG-05 analog)', async ({
    adminLoginPage,
    merchantPricingPage,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    await merchantPricingPage.open(adminData.chargeDistribution.pricingMerchantId);
    await merchantPricingPage.attemptMerchantWiseRatePercentage(adminData.chargeDistribution.negativePercentage);

    await expect(merchantPricingPage.fieldError(adminData.chargeDistribution.negativePercentageError)).toBeVisible();
    // Leave no trace: this merchant must stay unconfigured for the other
    // tests in this file.
    await merchantPricingPage.cancelMerchantWiseRateButton.click();
  });

  test('a merchant wise rate percentage over 100 is rejected (NEG-07 analog)', async ({
    adminLoginPage,
    merchantPricingPage,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    await merchantPricingPage.open(adminData.chargeDistribution.pricingMerchantId);
    await merchantPricingPage.attemptMerchantWiseRatePercentage(adminData.chargeDistribution.overHundredPercentage);

    await expect(
      merchantPricingPage.fieldError(adminData.chargeDistribution.overHundredPercentageError)
    ).toBeVisible();
    await merchantPricingPage.cancelMerchantWiseRateButton.click();
  });

  test('the Super merchant pricing check reports no violations (SM floor rule)', async ({
    adminLoginPage,
    applicationsListPage,
    superMerchantPricingCheckDialog,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    await applicationsListPage.goToApplications();
    await applicationsListPage.superMerchantPricingCheckButton.click();

    // This is the platform's own live enforcement of the SM business
    // rule: "a sub-merchant must never pay less than its super merchant
    // ... or the super merchant's commission on it is negative" — the
    // real-world analog of a negative-commission scenario.
    await expect(superMerchantPricingCheckDialog.passMessage).toBeVisible({ timeout: 15_000 });
    await superMerchantPricingCheckDialog.close();
  });
});
