// @ts-check
const path = require('path');
const { test, expect } = require('../../fixtures/merchant.fixtures');
const { readBulkMerchantRecords } = require('../../utils/bulkDataReader');

const asset = (name) => path.join(__dirname, '../../data/merchant/assets', name);

/**
 * Data-driven merchant onboarding: one full 8-step wizard run per row in a
 * bulk data file (`.json`, `.csv`, or `.xlsx` — see utils/bulkDataReader.js),
 * instead of a single hand-written merchant like merchantOnboarding.spec.js.
 * Generates one `test()` per record so each merchant gets its own pass/fail/
 * skip in the report.
 *
 * Defaults to data/merchant/bulkMerchants.json; point BULK_DATA_FILE at a
 * .csv or .xlsx file to use those instead (same column names either way —
 * see bulkMerchants.csv for the CSV version of the same 3 example rows).
 * All records share the same upload assets (data/merchant/assets/*.png)
 * since a flat data file isn't a practical place to carry real images.
 *
 * All 3 example records have been run for real against merchant-dev
 * (2026-11-24, via the devOtp shortcut in a real, non-automated browser —
 * see VerifyMobileOtpPage.js), producing genuine applications:
 *  - Rahim General Store  (01890001111) -> TP-2026-000097
 *  - Karim Fashion House  (01890002222) -> TP-2026-000098
 *  - Sultana Food Corner  (01890003333) -> TP-2026-000099
 * All three numbers are now consumed, same one-shot caveat as everywhere
 * else in this framework — replace them with fresh, never-used Bangladeshi
 * numbers to exercise the wizard again (see merchantTestData.js, README.md).
 * Like every other test here, each row still needs Cloudflare Turnstile to
 * let "Send OTP" through, which only happens in a real, non-automated
 * browser (see README) — under Playwright itself, every row below either
 * `test.skip()`s with `blockedByCaptcha`, or (now that these 3 numbers are
 * consumed) with the already-registered guard, same as merchantOnboarding.spec.js.
 */
const BULK_DATA_FILE = process.env.BULK_DATA_FILE || path.join(__dirname, '../../data/merchant/bulkMerchants.json');
const records = readBulkMerchantRecords(BULK_DATA_FILE);

/** @param {Record<string, string>} record */
function toWizardData(record) {
  return {
    merchantType: record.merchantType,
    personalInformation: {
      fullName: record.fullName,
      email: record.email,
      hasNid: true,
      nidNumber: record.nidNumber,
      dateOfBirth: record.dateOfBirth,
      profilePhotoPath: asset('profile-photo.png'),
      nidPhotoPath: asset('nid-photo.png'),
    },
    businessInformation: {
      businessName: record.businessName,
      ownerName: record.ownerName,
      ownerBrsNo: record.ownerBrsNo,
      division: record.division,
      district: record.district,
      upazila: record.upazila,
      postalCode: record.postalCode,
      street: record.street,
      fullAddress: record.fullAddress,
      shopImagePath: asset('shop-photo.png'),
      authorizedSignaturePath: asset('signature.png'),
    },
    businessDetails: {
      businessType: record.businessType,
      sectorType: record.sectorType,
      businessCategory: record.businessCategory,
      serviceType: record.serviceType,
    },
    businessSupportDetails: {
      supportMobile: record.mobile,
      supportEmail: record.supportEmail,
      businessStartingYear: record.businessStartingYear,
      ownerNameSupport: record.ownerNameSupport,
      companyNetWorth: record.companyNetWorth,
      monthlyTransactionValue: record.monthlyTransactionValue,
      mainProductServiceName: record.mainProductServiceName,
    },
    primaryContact: {
      name: record.contactName,
      designation: record.contactDesignation,
      email: record.contactEmail,
      mobile: record.mobile,
    },
    bankDetails: {
      bankName: record.bankName,
      branchName: record.branchName,
      accountName: record.accountName,
      accountNumber: record.accountNumber,
      chequeImagePath: asset('cheque.png'),
    },
  };
}

test.describe('Merchant Onboarding — bulk data-driven', () => {
  for (const record of records) {
    test(`onboard "${record.businessName}" (${record.mobile}) @bulk`, async ({
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
      const data = toWizardData(record);

      await homePage.clickBecomeMerchant();

      const { blockedByCaptcha } = await verifyMobileOtpPage.loginWithDevOtp(record.mobile);
      test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on the mobile verification step (see README).');

      if (await applicationStatusPage.hasExistingApplication()) {
        const existingId = await applicationStatusPage.getApplicationId();
        test.skip(
          true,
          `${record.mobile} already has an application (${existingId}) — replace it with a fresh number in the bulk data file.`
        );
      }

      await merchantTypePage.selectMerchantType(data.merchantType);
      await merchantTypePage.goToNextStep();

      await personalInformationPage.fillPersonalInformation(data.personalInformation);
      await personalInformationPage.goToNextStep();

      await businessInformationPage.fillBusinessInformation(data.businessInformation);
      await businessInformationPage.goToNextStep();

      await businessDetailsPage.fillBusinessDetails(data.businessDetails);
      await businessDetailsPage.goToNextStep();

      await businessSupportDetailsPage.fillBusinessSupportDetails(data.businessSupportDetails);
      await businessSupportDetailsPage.goToNextStep();

      await contactPersonsPage.fillPrimaryContact(data.primaryContact);
      await contactPersonsPage.goToNextStep();

      await bankDetailsPage.fillBankDetails(data.bankDetails);
      await bankDetailsPage.goToNextStep();

      await expect(reviewRegistrationPage.heading).toBeVisible();
      await reviewRegistrationPage.acceptTerms();
      await reviewRegistrationPage.submitApplication();

      await expect(applicationStatusPage.successHeading).toBeVisible();
      const applicationId = await applicationStatusPage.getApplicationId();
      expect(applicationId).toMatch(/^TP-\d{4}-\d+$/);

      test.info().annotations.push({
        type: 'info',
        description: `${record.businessName} (${record.mobile}): submitted ${applicationId}`,
      });
    });
  }
});
