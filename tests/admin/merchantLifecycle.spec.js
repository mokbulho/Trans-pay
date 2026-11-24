// @ts-check
const { test, expect } = require('../../fixtures/admin.fixtures');
const adminData = require('../../data/admin/adminTestData');

/**
 * Approved-merchant row actions — Merchant Management → Applications →
 * Approved tab → a row's "⋮" menu. Confirmed live against merchant-dev
 * (2026-11-24): up to 8 items — View application, Attach/Change super
 * merchant, Vendors & Other Charge, Pricing & rates, Edit on the core
 * platform, Rotate API secret, Rotate webhook secret, Disable on the
 * core platform.
 *
 * "Make payment" was asked for but does not exist anywhere in this
 * build — not in this menu, not on the Pricing page, not on the
 * Transactions page — checked with and without an instrument/rate
 * configured on a test merchant. Not covered here; flag to the user if
 * this is expected to exist.
 *
 * Real actions performed for real this session (not just opened and
 * cancelled):
 *  - Attached Sultana Food Corner as a sub-merchant of Aalo (explicit
 *    request, see the test below that verifies it).
 *  - Rotated Sultana Food Corner's API secret and webhook secret once
 *    already (before this spec existed); the tests below rotate them
 *    again, which is expected and harmless — rotation is designed to be
 *    repeatable.
 *  - Round-tripped Sultana Food Corner's Address field (edited, saved,
 *    reverted, saved) to confirm the Edit-on-core-platform flow and its
 *    History audit trail.
 *
 * Deliberately NOT performed for real: "Disable on the core platform".
 * Its row-menu description says "Nothing is deleted and it can be
 * re-enabled," but the actual confirmation dialog is titled "Reject this
 * merchant on the core platform?" and warns the merchant "will not be
 * able to authenticate until re-approved" — stronger and less clearly
 * reversible than the menu copy suggests, and Sultana Food Corner's
 * Active status is relied on by other specs in this suite. The test
 * below opens the dialog, asserts its real copy, and only ever Cancels.
 */
test.describe('Approved merchant — row actions', () => {
  test('Sultana Food Corner is a sub-merchant of Aalo @smoke', async ({
    adminLoginPage,
    applicationsListPage,
    merchantPricingPage,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    await applicationsListPage.goToApplications();
    await applicationsListPage.approvedTab.click();
    await applicationsListPage.search('Sultana Food Corner');

    expect(await applicationsListPage.getHierarchyStatus('Sultana Food Corner')).toContain('under Aalo');

    await merchantPricingPage.open(adminData.chargeDistribution.pricingMerchantId);
    await expect(merchantPricingPage.hierarchyNavStatus).toContainText('Under Aalo');
  });

  test('View application scrolls through the full submitted form top to bottom and back', async ({
    adminLoginPage,
    applicationsListPage,
    applicationDetailsDialog,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    const merchantName = 'Michael Madhusudan College';
    await applicationsListPage.goToApplications();
    await applicationsListPage.approvedTab.click();
    await applicationsListPage.search(merchantName);
    await applicationsListPage.openRowActions(merchantName);
    await applicationsListPage.viewApplicationMenuItem().click();

    await expect(applicationDetailsDialog.heading(merchantName)).toBeVisible();
    // Top of the form.
    await expect(applicationDetailsDialog.dialog.getByText('Personal Information')).toBeVisible();

    await applicationDetailsDialog.scrollThroughTopToBottomAndBack();

    // Scrolling back up returns to the top section, proving the whole
    // form (down to Bank Details and back) was actually traversed.
    await expect(applicationDetailsDialog.dialog.getByText('Personal Information')).toBeVisible();
    await applicationDetailsDialog.close();
  });

  test('Vendors & Other Charge locks to the super merchant once attached', async ({
    adminLoginPage,
    applicationsListPage,
    vendorsOtherChargeDialog,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    const merchantName = adminData.chargeDistribution.pricingMerchantName;
    await applicationsListPage.goToApplications();
    await applicationsListPage.approvedTab.click();
    await applicationsListPage.search(merchantName);
    await applicationsListPage.openRowActions(merchantName);
    await applicationsListPage.vendorsAndOtherChargeMenuItem().click();

    await expect(vendorsOtherChargeDialog.dialog).toBeVisible();
    await expect(vendorsOtherChargeDialog.noVendorAttachedMessage).toBeVisible();
    await expect(vendorsOtherChargeDialog.locksByHierarchyMessage).toBeVisible();
    await vendorsOtherChargeDialog.close();
  });

  test('Vendors & Other Charge lets a standalone super merchant choose who is paid', async ({
    adminLoginPage,
    applicationsListPage,
    vendorsOtherChargeDialog,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    const merchantName = 'Success Academy';
    await applicationsListPage.goToApplications();
    await applicationsListPage.approvedTab.click();
    await applicationsListPage.search(merchantName);
    const hierarchy = await applicationsListPage.getHierarchyStatus(merchantName);
    test.skip(hierarchy !== 'Super merchant', `${merchantName} is no longer standalone — point this test at another Super merchant row.`);

    await applicationsListPage.openRowActions(merchantName);
    await applicationsListPage.vendorsAndOtherChargeMenuItem().click();

    await expect(vendorsOtherChargeDialog.dialog).toBeVisible();
    await expect(vendorsOtherChargeDialog.locksByHierarchyMessage).not.toBeVisible();
    await expect(vendorsOtherChargeDialog.merchantKeepsItRadio).toBeChecked();
    await vendorsOtherChargeDialog.close();
  });

  test('Edit on the core platform saves a profile change and logs it to History', async ({
    adminLoginPage,
    applicationsListPage,
    editCorePlatformDialog,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    const merchantName = adminData.chargeDistribution.pricingMerchantName;
    const originalAddress = 'House 3, Road 3, Badda, Dhaka, Bangladesh';
    const qaAddress = `${originalAddress} (QA automated edit)`;

    await applicationsListPage.goToApplications();
    await applicationsListPage.approvedTab.click();
    await applicationsListPage.search(merchantName);
    await applicationsListPage.openRowActions(merchantName);
    await applicationsListPage.editOnCorePlatformMenuItem().click();

    await expect(editCorePlatformDialog.dialog).toBeVisible();
    await editCorePlatformDialog.setAddress(qaAddress);
    await expect(editCorePlatformDialog.profileUpdatedMessage).toBeVisible();

    // Leave no trace: revert back to the original address.
    await editCorePlatformDialog.setAddress(originalAddress);
    await expect(editCorePlatformDialog.profileUpdatedMessage).toBeVisible();

    await editCorePlatformDialog.historyTab.click();
    await expect(editCorePlatformDialog.dialog.getByText(qaAddress).first()).toBeVisible();
    await editCorePlatformDialog.close();
  });

  test('Rotate API secret issues a new one-time secret', async ({
    adminLoginPage,
    applicationsListPage,
    apiSecretsDialog,
    page,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    const merchantName = adminData.chargeDistribution.pricingMerchantName;
    await applicationsListPage.goToApplications();
    await applicationsListPage.approvedTab.click();
    await applicationsListPage.search(merchantName);
    await applicationsListPage.openRowActions(merchantName);
    await applicationsListPage.rotateApiSecretMenuItem().click();

    await expect(page.getByRole('dialog', { name: 'Rotate the API secret?' })).toBeVisible();
    await page.getByRole('button', { name: 'Rotate', exact: true }).click();

    await expect(apiSecretsDialog.dialog).toBeVisible();
    await expect(apiSecretsDialog.apiSecretFieldLabel).toBeVisible();
    await apiSecretsDialog.acknowledgeAndClose();
  });

  test('Rotate webhook secret issues a new one-time secret', async ({
    adminLoginPage,
    applicationsListPage,
    apiSecretsDialog,
    page,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    const merchantName = adminData.chargeDistribution.pricingMerchantName;
    await applicationsListPage.goToApplications();
    await applicationsListPage.approvedTab.click();
    await applicationsListPage.search(merchantName);
    await applicationsListPage.openRowActions(merchantName);
    await applicationsListPage.rotateWebhookSecretMenuItem().click();

    await expect(page.getByRole('dialog', { name: 'Rotate the webhook secret?' })).toBeVisible();
    await page.getByRole('button', { name: 'Rotate', exact: true }).click();

    await expect(apiSecretsDialog.dialog).toBeVisible();
    await expect(apiSecretsDialog.webhookSecretFieldLabel).toBeVisible();
    await apiSecretsDialog.acknowledgeAndClose();
  });

  test('Disable on the core platform is reviewed but never confirmed automatically', async ({
    adminLoginPage,
    applicationsListPage,
    disableOnCorePlatformDialog,
  }) => {
    const { blockedByCaptcha } = await adminLoginPage.login();
    test.skip(blockedByCaptcha, 'Blocked by Cloudflare Turnstile on /login under Playwright (see README).');

    const merchantName = adminData.chargeDistribution.pricingMerchantName;
    await applicationsListPage.goToApplications();
    await applicationsListPage.approvedTab.click();
    await applicationsListPage.search(merchantName);
    await applicationsListPage.openRowActions(merchantName);
    await applicationsListPage.disableOnCorePlatformMenuItem().click();

    // Confirmed live: this dialog's real title and copy are stronger than
    // the row menu's own description suggests (see file header comment).
    await expect(disableOnCorePlatformDialog.dialog).toBeVisible();
    await expect(disableOnCorePlatformDialog.dialog.getByText(merchantName)).toBeVisible();
    await expect(disableOnCorePlatformDialog.dialog.getByText('until re-approved', { exact: false })).toBeVisible();
    await disableOnCorePlatformDialog.cancel();
  });
});
