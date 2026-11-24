// @ts-check
const { test, expect } = require('../../fixtures/merchant.fixtures');
const merchantData = require('../../data/merchant/merchantTestData');

test.describe('Merchant Onboarding', () => {
  test('clicking "Become a Merchant" opens the onboarding wizard @smoke', async ({ page, homePage }) => {
    await homePage.clickBecomeMerchant();

    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole('heading', { name: 'Start Your Transpay Journey' })).toBeVisible();

    // The 7 data-entry steps are previewed up front (Review Registration,
    // the 8th step, is the submission screen and isn't listed here).
    const steps = [
      'Merchant Type',
      'Personal Information',
      'Business Information',
      'Business Details',
      'Business Support Details',
      'Contact Persons',
      'Bank Details',
    ];
    for (const step of steps) {
      // The step label appears twice (summary list + hover-preview list), so scope to the first match.
      await expect(page.getByText(step, { exact: true }).first()).toBeVisible();
    }
  });

  test('mobile number can be entered on the verification screen @smoke', async ({
    page,
    homePage,
    verifyMobileOtpPage,
  }) => {
    await homePage.clickBecomeMerchant();
    await expect(verifyMobileOtpPage.heading).toBeVisible();

    const { blockedByCaptcha } = await verifyMobileOtpPage.waitForMobileNumberAccepted(merchantData.verifiedMobileNumber);
    await expect(verifyMobileOtpPage.mobileNumberInput).toHaveValue(merchantData.verifiedMobileNumber);

    // Cloudflare Turnstile's own lifecycle (checking -> interactive checkbox ->
    // error/retry) is inherently non-deterministic for an automated browser —
    // Turnstile is designed to behave differently for bots. We only assert on
    // what the test itself controls (the number was accepted) and record what
    // Turnstile did as an annotation + screenshot for a human to review, rather
    // than hard-asserting on a third-party widget's transient state.
    test.info().annotations.push({
      type: blockedByCaptcha ? 'blocked' : 'info',
      description: blockedByCaptcha
        ? 'Cloudflare Turnstile challenge rendered after entering the mobile number — automated OTP request is not possible (by design, see README).'
        : 'No Turnstile challenge rendered for this run.',
    });
    await test
      .info()
      .attach('verify-mobile-number-state', { body: await page.screenshot(), contentType: 'image/png' });
  });

  // Full 8-step walkthrough, confirmed field-by-field against the live
  // merchant-dev wizard and actually submitted for real on 2026-11-24
  // using the devOtp dev-mode shortcut (see VerifyMobileOtpPage.js),
  // producing application TP-2026-000096 (mobile 01686687277) — one of
  // several real applications submitted this way; see
  // merchantTestData.registeredMobileNumbers for the full list. Skips
  // itself if Cloudflare Turnstile blocks the run (reliable in headless CI, not in a real,
  // non-automated browser) or if MERCHANT_MOBILE_NUMBER already has an
  // application on file — a fixed dev-environment phone number is a
  // one-shot resource, not a repeatable fixture; see merchantTestData.js.
  //
  // NOTE: this test performs a REAL submission to merchant-dev. Only
  // point MERCHANT_MOBILE_NUMBER at a number you're prepared to consume.
  test('merchant can complete the full registration wizard end-to-end', async ({
    page,
    homePage,
    verifyMobileOtpPage,
    merchantTypePage,
    personalInformationPage,
    businessInformationPage,
    businessDetailsPage,
    businessSupportDetailsPage,
    contactPersonsPage,
    bankDetailsPage,
    reviewRegistrationPage,
    applicationStatusPage,
  }) => {
    await homePage.clickBecomeMerchant();

    const { blockedByCaptcha } = await verifyMobileOtpPage.loginWithDevOtp(merchantData.verifiedMobileNumber);
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on the mobile verification step (see README).');

    if (await applicationStatusPage.hasExistingApplication()) {
      const applicationId = await applicationStatusPage.getApplicationId();
      test.skip(
        true,
        `${merchantData.verifiedMobileNumber} already has an application (${applicationId}) — ` +
          'set a fresh MERCHANT_MOBILE_NUMBER to exercise the wizard again (see merchantTestData.js).'
      );
    }

    await expect(page.getByRole('heading', { name: 'Merchant Onboarding' })).toBeVisible();

    await merchantTypePage.selectMerchantType(merchantData.merchantType);
    await merchantTypePage.goToNextStep();

    await personalInformationPage.fillPersonalInformation(merchantData.personalInformation);
    await personalInformationPage.goToNextStep();

    await businessInformationPage.fillBusinessInformation(merchantData.businessInformation);
    await businessInformationPage.goToNextStep();

    await businessDetailsPage.fillBusinessDetails(merchantData.businessDetails);
    await businessDetailsPage.goToNextStep();

    await businessSupportDetailsPage.fillBusinessSupportDetails(merchantData.businessSupportDetails);
    await businessSupportDetailsPage.goToNextStep();

    await contactPersonsPage.fillPrimaryContact(merchantData.primaryContact);
    await contactPersonsPage.goToNextStep();

    await bankDetailsPage.fillBankDetails(merchantData.bankDetails);
    await bankDetailsPage.goToNextStep();

    await expect(reviewRegistrationPage.heading).toBeVisible();
    await reviewRegistrationPage.acceptTerms();
    await reviewRegistrationPage.submitApplication();

    await expect(applicationStatusPage.successHeading).toBeVisible();
    const applicationId = await applicationStatusPage.getApplicationId();
    expect(applicationId).toMatch(/^TP-\d{4}-\d+$/);
    await expect.soft(applicationStatusPage.getStatus()).resolves.toBe('Awaiting review');

    test.info().annotations.push({ type: 'info', description: `Submitted application ${applicationId}` });
  });
});
