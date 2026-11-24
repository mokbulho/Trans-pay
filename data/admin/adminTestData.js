/**
 * Test data for the Admin Console's merchant approval workflow.
 *
 * IMPORTANT — same one-shot shape as the merchant-side test data
 * (see data/merchant/merchantTestData.js): a merchant application can only
 * be approved or rejected once. `approveTarget` / `rejectTarget` below
 * name real, already-submitted Pending applications from the bulk-data
 * run (see data/merchant/bulkMerchants.json) that haven't been decided on
 * yet. Once a run approves/rejects one, point these at a different still-
 * Pending merchant name to exercise the flow again — the tests detect an
 * already-decided merchant via `applicationsListPage.getStatus()` and
 * skip themselves rather than failing.
 */
module.exports = {
  approveTarget: {
    merchantName: 'Rahim General Store',
    domain: 'https://rahimgeneralstore.example.com',
    allowedIp: '180.148.212.90',
    settlementCycleDays: 7,
  },

  rejectTarget: {
    merchantName: 'TransPay QA Test Store 4',
    reason: 'Shop/Office Image is unclear - please re-upload a clearer photo of your storefront.',
  },

  // Already approved for real (2026-11-24) — permanent, safe to depend on
  // regardless of test order or whether approveTarget has run yet.
  approvedMerchantForPricingCheck: 'Sultana Food Corner',
};
