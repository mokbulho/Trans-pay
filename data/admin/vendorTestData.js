const path = require('path');
const { uniqueSuffix, uniqueEmail, uniqueBusinessName, uniqueMobileNumber } = require('../../utils/dataGenerator');

const merchantAsset = (name) => path.join(__dirname, '../merchant/assets', name);

/**
 * Test data for the Vendor management journey (onboard → approve →
 * attach to a merchant → assign its Other Charge payout → detach),
 * validated by manually driving the real wizard end-to-end on
 * merchant-dev (2026-11-25) and creating two real vendors (VND-00000003
 * "SoftBD Ltd", kept and attached to Aalo for real; VND-00000004
 * "QA Vendor Explorer Co", a throwaway used only to confirm selectors,
 * approved then detached again).
 *
 * IMPORTANT — Mobile Number is hinted "Unique to this vendor" on
 * Personal Information, and Business Name has no such hint but a fixed
 * name would collide across repeat runs against this shared
 * environment, so both are generated fresh per run (see
 * utils/dataGenerator.js) rather than hardcoded.
 *
 * approveAndAttachMerchant names a real, permanent, standalone (no
 * super merchant) approved merchant — required by the Approve dialog,
 * which "Only [lists] approved merchants with no super merchant...:
 * they own their Other Charge." Aalo is Sultana Food Corner's real
 * super merchant elsewhere in this project and is itself standalone,
 * so it is a stable target here too.
 */
function buildVendor(prefix = 'QA Vendor') {
  const suffix = uniqueSuffix();
  const fullName = `${prefix} ${suffix}`;
  const mobileNumber = uniqueMobileNumber();
  const email = uniqueEmail(`qa.vendor.${suffix}`);

  return {
    personalInformation: {
      fullName,
      email,
      mobileNumber,
      hasNid: true,
      nidNumber: '1995010112345',
      dateOfBirth: '1995-01-01',
      profilePhotoPath: merchantAsset('profile-photo-man.png'),
      nidPhotoPath: merchantAsset('profile-photo-man.png'),
    },

    businessInformation: {
      businessName: uniqueBusinessName(`${prefix} Co`),
      ownerName: fullName,
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Badda',
      postalCode: '1212',
      street: 'Road 5, Badda',
      fullAddress: 'House 10, Road 5, Badda, Dhaka-1212, Bangladesh',
      shopImagePath: merchantAsset('shop-photo.png'),
      authorizedSignaturePath: merchantAsset('signature.png'),
    },

    primaryContact: {
      fullName,
      designation: 'Proprietor',
      email,
      mobileNumber,
    },

    bankDetails: {
      bankName: 'DUTCH-BANGLA BANK LTD',
      branchName: 'Banani',
      // Account Name "must match the business name on the account" —
      // filled in from businessInformation.businessName by the caller.
      accountNumber: `20515${uniqueSuffix().slice(-8)}`,
      chequeImagePath: merchantAsset('cheque.png'),
    },
  };
}

module.exports = {
  buildVendor,

  // Real, permanent, standalone approved merchant — see file header.
  approveAndAttachMerchant: 'Aalo',

  // Kept for real (2026-11-25): VND-00000003 "SoftBD Ltd", approved and
  // attached to Aalo, whose Other Charge it is paid instead of Aalo.
  existingVendorReference: 'VND-00000003',
};
