const path = require('path');
const { environment } = require('../../config/environment');
const { BusinessDetailsPage } = require('../../pages/merchant/BusinessDetailsPage');

const asset = (name) => path.join(__dirname, 'assets', name);

/**
 * Test data for the merchant onboarding flow, validated by manually
 * driving the real wizard end-to-end on merchant-dev and submitting it
 * for real using the devOtp dev-mode shortcut (see VerifyMobileOtpPage.js).
 * Every value below is one the live form actually accepted.
 *
 * IMPORTANT — a mobile number is consumed once it has an application:
 * logging in with it no longer reaches a blank wizard, it goes straight to
 * ApplicationStatusPage showing that application. The full-wizard test
 * detects this (`applicationStatusPage.hasExistingApplication()`) and skips
 * itself rather than failing, but it also means a fixed number can't
 * exercise a second "fresh onboarding" run. To get real wizard coverage
 * again, set MERCHANT_MOBILE_NUMBER (.env) to a new, never-used Bangladeshi
 * mobile number — generating one per CI run (see utils/dataGenerator.js)
 * would make this repeatable instead of a one-shot.
 */
module.exports = {
  verifiedMobileNumber: environment.merchantMobileNumber,

  // Real, already-consumed numbers kept around on purpose, for
  // tests/merchant/applicationStatus.spec.js to assert against — these
  // will never see a blank wizard again, which is exactly the point.
  registeredMobileNumbers: {
    awaitingReview: {
      mobile: '01686687277',
      applicationId: 'TP-2026-000096',
      status: 'Awaiting review',
    },
    approved: {
      mobile: '01867742596',
      applicationId: 'TP-2026-000023',
      status: 'Approved',
    },
  },

  merchantType: 'Proprietorship', // one of MerchantTypePage.OPTIONS

  personalInformation: {
    fullName: 'Mokbul Hossain',
    email: 'qa.merchant.test2@example.com',
    hasNid: true,
    nidNumber: '1992051234567',
    dateOfBirth: '1992-05-15',
    profilePhotoPath: asset('profile-photo.png'),
    nidPhotoPath: asset('nid-photo.png'),
  },

  businessInformation: {
    businessName: 'TransPay QA Test Store',
    ownerName: 'Mokbul Hossain',
    ownerBrsNo: 'BRS-00998877',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Badda',
    postalCode: '1212',
    street: 'Road 7, House 20',
    fullAddress: 'House 20, Road 7, Badda, Dhaka, Bangladesh',
    shopImagePath: asset('shop-photo.png'),
    authorizedSignaturePath: asset('signature.png'),
  },

  businessDetails: {
    businessType: BusinessDetailsPage.BUSINESS_TYPES.soleTrader,
    sectorType: BusinessDetailsPage.SECTOR_TYPES.private,
    businessCategory: BusinessDetailsPage.BUSINESS_CATEGORIES.retail,
    serviceType: BusinessDetailsPage.SERVICE_TYPES.goods,
  },

  businessSupportDetails: {
    supportMobile: '01686687277',
    supportEmail: 'support.qa2@example.com',
    businessStartingYear: '2025',
    ownerNameSupport: 'Mokbul Hossain',
    companyNetWorth: '450000',
    monthlyTransactionValue: '180000',
    mainProductServiceName: 'General Retail Goods',
  },

  primaryContact: {
    name: 'Mokbul Hossain',
    designation: 'Owner',
    email: 'contact.qa2@example.com',
    mobile: '01686687277',
  },

  bankDetails: {
    bankName: 'DUTCH-BANGLA BANK LTD',
    branchName: 'Banani',
    accountName: 'TransPay QA Test Store',
    accountNumber: '9876543210123',
    chequeImagePath: asset('cheque.png'),
  },
};
