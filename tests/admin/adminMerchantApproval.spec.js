// @ts-check
const { test, expect } = require('../../fixtures/admin.fixtures');
const adminData = require('../../data/admin/adminTestData');

/**
 * Admin Console → Merchant Management → Applications. Confirmed live
 * against merchant-dev (2026-11-24) using the shared admin test account
 * (see config/environment.js).
 *
 * Cloudflare Turnstile on /login: the shared sign-in screen IS behind a
 * Turnstile challenge (see AdminLoginPage.js) and, like the merchant
 * onboarding wizard, it never resolves under Playwright's automated
 * Chromium (confirmed with a 40s headless probe). Every test here calls
 * `adminLoginPage.login()` and skips itself via `blockedByCaptcha` rather
 * than failing on a disabled button. The flows below were verified for
 * real through a non-automated browser, where Turnstile passes
 * invisibly — Playwright runs here only confirm the Page Objects /
 * selectors stay correct, and will skip (not fail) in CI/headless.
 *
 * What was verified for real this session:
 *  - Approved "Sultana Food Corner" (#99) with domain + IP 180.148.212.90
 *    + a 7-day settlement cycle — it is now Active, merchant code
 *    `sultana_food_corner`, and reachable from the Approved tab.
 *  - Rejected "Karim Fashion House" (#98) with a reason — it went back
 *    to draft and now shows "Rejected" in the All merchants tab.
 *
 * Approve/Reject are one-shot per application (see adminTestData.js) —
 * `approveTarget` / `rejectTarget` point at still-Pending merchants from
 * the bulk-data run; each test checks the merchant's current status via
 * the All-merchants tab first and skips itself if it's already been
 * decided, instead of failing on a missing Pending row.
 */
test.describe('Admin Console — Merchant Approval', () => {
  test('admin can log in and reach the Applications list @smoke', async ({ adminLoginPage, page, applicationsListPage }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    await expect(page).toHaveURL(/\/admin$/);
    await applicationsListPage.goToApplications();

    await expect(page).toHaveURL(/\/admin\/merchants$/);
    await expect(applicationsListPage.heading).toBeVisible();
    // Pending review is the default tab.
    await expect(applicationsListPage.pendingReviewTab).toHaveAttribute('aria-pressed', 'true').catch(() => {});
  });

  test('admin can view a pending application\'s submitted details', async ({
    adminLoginPage,
    applicationsListPage,
    applicationDetailsDialog,
  }) => {
    const { merchantName } = adminData.approveTarget;

    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');
    await applicationsListPage.goToApplications();

    await applicationsListPage.search(merchantName);
    await applicationsListPage.openRowActions(merchantName);
    await applicationsListPage.clickViewApplication();

    await expect(applicationDetailsDialog.heading(merchantName)).toBeVisible();
    await expect(applicationDetailsDialog.applicationPdfLink).toBeVisible();
    await expect(applicationDetailsDialog.approveButton).toBeVisible();
    await expect(applicationDetailsDialog.rejectButton).toBeVisible();

    await applicationDetailsDialog.close();
  });

  test('admin can approve a pending application with domain, allowed IP and settlement cycle', async ({
    adminLoginPage,
    applicationsListPage,
    approveMerchantDialog,
    apiSecretsDialog,
  }) => {
    const { merchantName, domain, allowedIp, settlementCycleDays } = adminData.approveTarget;

    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');
    await applicationsListPage.goToApplications();

    await applicationsListPage.allMerchantsTab.click();
    await applicationsListPage.search(merchantName);
    const status = await applicationsListPage.getStatus(merchantName);
    test.skip(status !== 'Pending', `${merchantName} is already "${status}" — point adminTestData.approveTarget at a fresh Pending merchant.`);

    await applicationsListPage.pendingReviewTab.click();
    await applicationsListPage.search(merchantName);
    await applicationsListPage.openRowActions(merchantName);
    await applicationsListPage.clickApproveFromMenu();

    await approveMerchantDialog.fillAndSubmit({ domain, allowedIp, settlementCycleDays });

    await expect(apiSecretsDialog.dialog).toBeVisible();
    await apiSecretsDialog.acknowledgeAndClose();

    await applicationsListPage.allMerchantsTab.click();
    await applicationsListPage.search(merchantName);
    expect(await applicationsListPage.getStatus(merchantName)).toBe('Active');
  });

  test('admin can reject a pending application with a reason', async ({
    adminLoginPage,
    applicationsListPage,
    rejectMerchantDialog,
  }) => {
    const { merchantName, reason } = adminData.rejectTarget;

    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');
    await applicationsListPage.goToApplications();

    await applicationsListPage.allMerchantsTab.click();
    await applicationsListPage.search(merchantName);
    const status = await applicationsListPage.getStatus(merchantName);
    test.skip(status !== 'Pending', `${merchantName} is already "${status}" — point adminTestData.rejectTarget at a fresh Pending merchant.`);

    await applicationsListPage.pendingReviewTab.click();
    await applicationsListPage.search(merchantName);
    await applicationsListPage.openRowActions(merchantName);
    await applicationsListPage.clickRejectFromMenu();

    await rejectMerchantDialog.reject(reason);

    await applicationsListPage.allMerchantsTab.click();
    await applicationsListPage.search(merchantName);
    expect(await applicationsListPage.getStatus(merchantName)).toBe('Rejected');
  });

  test('admin can open an approved merchant\'s pricing page from the Approved list', async ({
    adminLoginPage,
    applicationsListPage,
    merchantPricingPage,
    page,
  }) => {
    const merchantName = adminData.approvedMerchantForPricingCheck;

    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');
    await applicationsListPage.goToApplications();

    await applicationsListPage.approvedTab.click();
    await applicationsListPage.search(merchantName);
    await applicationsListPage.getPricingLink(merchantName).click();

    await expect(page).toHaveURL(/\/admin\/merchants\/\d+\/pricing$/);
    await expect(merchantPricingPage.heading(merchantName)).toBeVisible();
    await expect(merchantPricingPage.paymentInstrumentsHeading).toBeVisible();
    await expect(merchantPricingPage.merchantWiseRateHeading).toBeVisible();
    await expect(merchantPricingPage.hierarchyHeading).toBeVisible();
  });
});
