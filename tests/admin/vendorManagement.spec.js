// @ts-check
const { test, expect } = require('../../fixtures/admin.fixtures');
const vendorData = require('../../data/admin/vendorTestData');

/**
 * Vendor management — Merchant Management → Vendors (`/admin/vendors`).
 * Confirmed live against merchant-dev (2026-11-25) by driving the real
 * 4-step wizard end-to-end twice: VND-00000003 "SoftBD Ltd" (kept for
 * real, approved, attached to Aalo and paid its Other Charge) and
 * VND-00000004 "QA Vendor Explorer Co" (a throwaway used only to
 * confirm selectors — approved, attached to Aalo, then detached again,
 * leaving no trace).
 *
 * IMPORTANT business rule, confirmed live — do not "fix" this away:
 * confirming "Pay Other Charge to this vendor" for a SECOND vendor on a
 * merchant that already pays a DIFFERENT vendor cannot take effect
 * "now" — the dialog's own copy names the next free day ("The earliest
 * day is ..."). Attaching a second vendor is harmless by itself; only
 * actually confirming the payout toggle schedules a real override. The
 * full-journey test below relies on this: it opens that dialog against
 * Aalo (which already pays VND-00000003 for real) only to assert the
 * conflict-aware copy, and deliberately never confirms it — then
 * detaches, so every run leaves Aalo's real payout to VND-00000003
 * untouched.
 */
test.describe('Vendor management', () => {
  test('Vendors list shows the expected tabs and a new-vendor entry point @smoke', async ({
    adminLoginPage,
    vendorsListPage,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    await vendorsListPage.goToVendors();

    await expect(vendorsListPage.heading).toBeVisible();
    await expect(vendorsListPage.newVendorButton).toBeVisible();
    await expect(vendorsListPage.awaitingApprovalTab).toBeVisible();
    await expect(vendorsListPage.draftsTab).toBeVisible();
    await expect(vendorsListPage.approvedTab).toBeVisible();
    await expect(vendorsListPage.sentBackTab).toBeVisible();
    await expect(vendorsListPage.allTab).toBeVisible();
  });

  test('SoftBD Ltd is Approved and is paid Aalo\'s Other Charge', async ({
    adminLoginPage,
    vendorDetailPage,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    await vendorDetailPage.open(vendorData.existingVendorReference);

    expect(await vendorDetailPage.getStatus()).toBe('Approved');
    const row = vendorDetailPage.getMerchantRow(vendorData.approveAndAttachMerchant);
    await expect(row).toBeVisible();
    await expect(row).toContainText(vendorData.existingVendorReference);
  });

  test('the full vendor journey: onboard, submit, approve, attach, assign, then detach', async ({
    adminLoginPage,
    vendorsListPage,
    vendorPersonalInfoStep,
    vendorBusinessInfoStep,
    vendorPrimaryContactStep,
    vendorBankDetailsStep,
    vendorDetailPage,
    page,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    const vendor = vendorData.buildVendor();

    // --- Onboard: create a draft and fill all 4 steps. ---
    await vendorsListPage.goToVendors();
    const reference = await vendorsListPage.createNewVendor();

    await vendorPersonalInfoStep.fillPersonalInformation(vendor.personalInformation);
    await vendorPersonalInfoStep.goToNextStep();

    await vendorBusinessInfoStep.fillBusinessInformation(vendor.businessInformation);
    await vendorBusinessInfoStep.goToNextStep();

    await vendorPrimaryContactStep.fillPrimaryContact(vendor.primaryContact);
    await vendorPrimaryContactStep.goToNextStep();

    await vendorBankDetailsStep.fillBankDetails({
      ...vendor.bankDetails,
      // "Must match the business name on the account".
      accountName: vendor.businessInformation.businessName,
    });

    // --- Submit: saving the last step submits the vendor for approval. ---
    await vendorBankDetailsStep.submitForApproval();

    expect(await vendorDetailPage.getStatus()).toBe('Awaiting approval');

    // --- Approve + attach in one action. ---
    await vendorDetailPage.approve([vendorData.approveAndAttachMerchant]);

    expect(await vendorDetailPage.getStatus()).toBe('Approved');
    const row = vendorDetailPage.getMerchantRow(vendorData.approveAndAttachMerchant);
    await expect(row).toBeVisible();
    // Attaching alone does not grant the payout — confirmed live, this
    // reads "The merchant" (not this vendor's own reference) even
    // though Aalo's Other Charge is, in reality, already paid to the
    // separate, real VND-00000003 relationship.
    await expect(row).toContainText('The merchant');
    await expect(row).not.toContainText(reference);

    // --- Assign: the payout toggle surfaces the real cross-vendor
    // conflict instead of silently succeeding. Never confirm this —
    // doing so would schedule a real future override on Aalo's actual
    // payout (see file header). ---
    const payoutButton = row.getByRole('button', { name: 'Pay Other Charge to this vendor' });
    await payoutButton.click();
    const payoutDialog = page.getByRole('dialog', { name: /^Pay .+'s Other Charge to/ });
    await expect(payoutDialog.getByText('The earliest day is', { exact: false })).toBeVisible();
    await payoutDialog.getByRole('button', { name: 'Cancel', exact: true }).click();

    // --- Leave no trace: detach again. ---
    await vendorDetailPage.detach(
      vendorData.approveAndAttachMerchant,
      'E2E automation run — leaving no trace on the shared environment.'
    );
    await expect(vendorDetailPage.notAttachedToAnyMerchantMessage).toBeVisible();
  });
});
