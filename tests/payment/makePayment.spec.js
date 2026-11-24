// @ts-check
const { test, expect } = require('../../fixtures/testMerchant.fixtures');
const { environment } = require('../../config/environment');
const testMerchantData = require('../../data/testMerchant/testMerchantData');

/**
 * "Make payment" — confirmed live (2026-11-24) to live on a separate
 * site, the test-merchant checkout tool at
 * https://testmerchant-transpay.softbd.xyz, NOT anywhere in the Admin
 * Console (its row-actions menu, Pricing page and Transactions page were
 * all checked and have nothing — see merchantLifecycle.spec.js).
 *
 * Unlike the Admin Console and the merchant onboarding wizard, none of
 * this site (nor the real Transpay gateway checkout, nor the TP Sandbox
 * PG simulator) is behind Cloudflare Turnstile or needs a sign-in, so
 * every test here runs for real under Playwright — no skip-guard needed
 * for that reason.
 *
 * Precondition done once, by hand, outside this suite (see
 * data/testMerchant/testMerchantData.js): Rahim General Store
 * (`rahim_general_store`) is registered and left ACTIVE as a profile on
 * the test-merchant tool, using an API secret / webhook secret obtained
 * for real from the Admin Console's Rotate API secret / Rotate webhook
 * secret dialogs, and has Payment instruments + a Merchant wise rate
 * already configured in Admin — the business-rule precondition this
 * feature was asked for ("before make payment set the charges rate of
 * the merchant and the payment gateway").
 *
 * The TP Sandbox PG simulator gates its 3 outcome buttons behind a
 * shared, per-environment "Simulated authorisation" PIN
 * (`tp_sandbox_pg.pin`, environment.sandboxSettlePin) — its own copy
 * says plainly this is "not a bank credential, and not proof anyone
 * authenticated," just a guard against a bare link triggering a settle.
 */
test.describe('Make payment (test-merchant checkout tool)', () => {
  // These tests share one mutable piece of external state — the test-
  // merchant tool's single "active profile" setting — which isn't
  // scoped per browser context/session the way admin/merchant cookies
  // are. Running them in parallel let two payments race against it and
  // produced a flaky failure (confirmed live, 2026-11-24).
  test.describe.configure({ mode: 'serial' });

  test('Merchant settings lists the active Rahim General Store profile @smoke', async ({
    merchantSettingsPage,
  }) => {
    await merchantSettingsPage.open();

    await expect(merchantSettingsPage.heading).toBeVisible();
    await expect(merchantSettingsPage.row(testMerchantData.activeMerchant.label)).toBeVisible();
    await expect(merchantSettingsPage.payingAsBanner).toContainText(testMerchantData.activeMerchant.label);
  });

  test('activating the profile keeps it the one used for new payments', async ({
    merchantSettingsPage,
  }) => {
    await merchantSettingsPage.open();

    // Idempotent: the Activate button is hidden on an already-active row,
    // so this is a no-op if it's already active — still asserts the
    // invariant the whole feature depends on.
    const row = merchantSettingsPage.row(testMerchantData.activeMerchant.label);
    const activateButton = row.getByRole('button', { name: 'Activate' });
    if (await activateButton.isVisible()) {
      await activateButton.click();
    }

    await expect(merchantSettingsPage.payingAsBanner).toContainText(testMerchantData.activeMerchant.label);
  });

  test('a payment settles as SUCCESS through the TP Sandbox simulator', async ({
    payPage,
    gatewayCheckoutPage,
    sandboxSimulatorPage,
    paymentStatusPage,
    page,
  }) => {
    await payPage.open();
    await payPage.payNow({ amount: 1000, fullName: 'QA Automated Test Payment' });

    await expect(page).toHaveURL(/transpay\.dev\.transpay\.com\.bd\/transpaypg\/checkout/);
    await gatewayCheckoutPage.payWith(testMerchantData.instrumentCode);

    await expect(page).toHaveURL(/tp_sandbox_pg\/simulator/);
    await sandboxSimulatorPage.settleAsSuccess(environment.sandboxSettlePin);

    await expect(paymentStatusPage.successHeading).toBeVisible();
    const transactionId = await paymentStatusPage.getTransactionId();
    expect(transactionId).toMatch(/^TPC-\d{8}-\d+-[a-f0-9]+$/);
  });

  test('a wrong PIN is rejected before a correct one settles the payment', async ({
    payPage,
    gatewayCheckoutPage,
    sandboxSimulatorPage,
    paymentStatusPage,
    page,
  }) => {
    await payPage.open();
    await payPage.payNow({ amount: 500, fullName: 'QA Wrong PIN Retry Test' });

    await expect(page).toHaveURL(/transpay\.dev\.transpay\.com\.bd\/transpaypg\/checkout/);
    await gatewayCheckoutPage.payWith(testMerchantData.instrumentCode);

    await sandboxSimulatorPage.enterPin('000000');
    await sandboxSimulatorPage.settleAsSuccessButton.click();
    await expect(sandboxSimulatorPage.wrongPinMessage).toBeVisible();

    // The same transaction stays settleable — correcting the PIN succeeds.
    await sandboxSimulatorPage.settleAsSuccess(environment.sandboxSettlePin);
    await expect(paymentStatusPage.successHeading).toBeVisible();
  });
});
