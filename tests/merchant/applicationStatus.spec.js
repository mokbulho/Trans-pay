// @ts-check
const { test, expect } = require('../../fixtures/merchant.fixtures');
const merchantData = require('../../data/merchant/merchantTestData');

/**
 * Covers what happens when a mobile number that already has an
 * application logs in: the 8-step wizard is skipped entirely and the
 * applicant lands on ApplicationStatusPage instead. Confirmed live
 * against merchant-dev with two real, already-consumed numbers (see
 * `registeredMobileNumbers` in merchantTestData.js):
 *  - 01686687277 -> TP-2026-000096, "Awaiting review" (submitted by this
 *    same framework via the full-wizard test's exact data)
 *  - 01867742596 -> TP-2026-000023, "Approved" (Md. Tanvir Rahaman)
 *
 * Both tests skip themselves if Cloudflare Turnstile blocks the run —
 * same reasoning as the full-wizard test in merchantOnboarding.spec.js;
 * see README.md.
 */
test.describe('Application Status', () => {
  test('an awaiting-review mobile number is detected as already registered and shows its status @smoke', async ({
    homePage,
    verifyMobileOtpPage,
    applicationStatusPage,
  }) => {
    const { mobile, applicationId, status } = merchantData.registeredMobileNumbers.awaitingReview;

    await homePage.clickBecomeMerchant();
    const { blockedByCaptcha } = await verifyMobileOtpPage.loginWithDevOtp(mobile);
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on the mobile verification step (see README).');

    // "Already registered" (hasExistingApplication) must be true regardless
    // of the specific status — this is the same check the full-wizard test
    // uses to decide whether to skip itself, so it's asserted directly here.
    expect(await applicationStatusPage.hasExistingApplication()).toBe(true);
    expect(await applicationStatusPage.isAwaitingReview()).toBe(true);
    expect(await applicationStatusPage.isApproved()).toBe(false);

    await expect(applicationStatusPage.successHeading).toBeVisible();
    expect(await applicationStatusPage.getApplicationId()).toBe(applicationId);
    expect(await applicationStatusPage.getStatus()).toBe(status);
  });

  test('an approved mobile number is detected as already registered and shows an approved status with a dashboard link @smoke', async ({
    homePage,
    verifyMobileOtpPage,
    applicationStatusPage,
  }) => {
    const { mobile, applicationId, status } = merchantData.registeredMobileNumbers.approved;

    await homePage.clickBecomeMerchant();
    const { blockedByCaptcha } = await verifyMobileOtpPage.loginWithDevOtp(mobile);
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on the mobile verification step (see README).');

    expect(await applicationStatusPage.hasExistingApplication()).toBe(true);
    expect(await applicationStatusPage.isApproved()).toBe(true);
    expect(await applicationStatusPage.isAwaitingReview()).toBe(false);

    await expect(applicationStatusPage.approvedHeading).toBeVisible();
    expect(await applicationStatusPage.getApplicationId()).toBe(applicationId);
    expect(await applicationStatusPage.getStatus()).toBe(status);

    // Only an approved merchant gets a dashboard link — an awaiting-review
    // applicant only sees Home / Download / Contact Support.
    await expect(applicationStatusPage.goToDashboardButton).toBeVisible();
  });
});
