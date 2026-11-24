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

  /**
   * Charge distribution (TP_Charge_Distribution_Scenarios.xlsx). Confirmed
   * live (2026-11-24): the real model is a markup/spread — Payment
   * instrument rate (PI) + Transpay's own "merchant wise rate" (TP) +
   * an optional "Other Charge" (V, see Vendors page) — with a Super/
   * Sub-merchant floor rule (SM) — not the spreadsheet's proportional
   * weighted split of one total charge (see README "Charge distribution").
   */
  chargeDistribution: {
    // Sultana Food Corner (merchant id 99) — approved, permanent, has no
    // merchant wise rate or enabled instruments configured, so it's a
    // stable target for read-only and validation-only assertions that
    // must never mutate real pricing. Attached as a sub-merchant of Aalo
    // (2026-11-24, see merchantLifecycle.spec.js) — still has nothing set
    // in sections 2/3, only its Hierarchy (section 4) changed.
    pricingMerchantId: 99,
    pricingMerchantName: 'Sultana Food Corner',
    // Confirmed real server-side validation messages (API returns 400,
    // and the UI surfaces these exact strings inline under the field).
    negativePercentage: -5,
    negativePercentageError: 'The percentage cannot be negative',
    overHundredPercentage: 150,
    overHundredPercentageError: 'The percentage cannot exceed 100',
  },
};
