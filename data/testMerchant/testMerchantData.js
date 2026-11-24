/**
 * Test data for the "Make payment" test-merchant tool
 * (https://testmerchant-transpay.softbd.xyz).
 *
 * `activeMerchant` names a profile already registered and left active
 * there for real (2026-11-24): Rahim General Store (merchant code
 * `rahim_general_store`), approved as a sub-merchant of Aalo, with
 * Payment instruments (ROCKET 1.00%, TP_SANDBOX_PG 1.50%) and a 2.00%
 * merchant wise rate already configured on its Admin Pricing page — see
 * chargeDistribution.spec.js / merchantLifecycle.spec.js. Its API/
 * webhook secrets were entered into the profile once, by hand, from the
 * Admin Console's Rotate API secret / Rotate webhook secret dialogs —
 * they are never re-entered by this suite, since the profile already
 * exists and stays active between runs.
 */
module.exports = {
  activeMerchant: {
    label: 'rahim_general_store',
    merchantName: 'Rahim General Store',
  },
  instrumentCode: 'TP_SANDBOX_PG',
};
