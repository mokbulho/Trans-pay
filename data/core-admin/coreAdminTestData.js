/**
 * Test data for the core platform admin console
 * (admin.dev.transpay.com.bd) — a separate site/system from
 * merchant-dev's own Admin Console, which `data/admin/adminTestData.js`
 * covers.
 *
 * Every value below was read directly from the live platform
 * (2026-11-25) via a real, authenticated session — none of it is
 * guessed or derived from the merchant-dev side. Treat this as
 * read-only reference data: this suite never edits or saves any of
 * these records (every Edit dialog opened is always cancelled).
 */
module.exports = {
  // Aalo — the same Super Merchant used throughout merchant-dev's
  // Vendor management / Charge distribution suites, here on the core
  // platform's own Merchant List.
  aalo: {
    transpayId: 'm1182',
    merchantUserId: 'mer-45610001',
    companyName: 'Aalo',
    whiteListedIp: '180.148.212.90',
    mobileNumber: '1734280912',
    email: 'aalosbd@yopmail.com',
    status: 'Enable',
    merchantType: 'Proprietorship',
    serviceChargeBorneBy: 'Citizen — payer pays it, shown on the checkout',
    bankDetails: {
      bankName: 'PRIME BANK LTD.',
      branch: 'ADAMJEE EPZ',
      accountNumber: '659000000000',
      // Confirmed live: reads "Begum Clinic", not "Aalo" — a real,
      // pre-existing data mismatch on this merchant's bank record, not
      // something this suite introduced or should "fix".
      accountHolderName: 'Begum Clinic',
      routingNumber: '170670036',
      settlementCycle: 'T+1',
    },
    assignedInstrument: 'TP Sandbox Payment Gateway (simulator)',
  },

  // TP_SANDBOX_PG's platform-wide rate row (id 1, Merchant Type
  // "Default" — the single global/fallback rate, not a per-merchant
  // override). This is the exact Actual Rate / Rate To Charge pair
  // independently reverse-engineered from 10 real Aalo transactions in
  // tests/payment/makePayment.spec.js before this page was found —
  // confirming that work rather than contradicting it.
  tpSandboxPgRate: {
    id: '1',
    instrumentName: 'TP_SANDBOX_PG',
    methodTypeName: 'tp_sandbox_pg',
    merchantType: 'Default',
    isRateInPercentage: 'True',
    actualRate: '1',
    rateToCharge: '1.5',
    bankPercentageTakenOn: 'Bill + Transpay charge + other charge + margin',
    applyMinimumCharge: false,
    applyMaximumCharge: false,
    isDiscountInPercentage: 'False',
    discountCharge: '0',
    applicableFrom: '11/06/2024',
    applicableTo: '30/11/2030',
    isActive: 'True',
  },

  // Aalo's Merchant Charge Mapping row — the per-merchant Transpay
  // charge (TP) — matches the 0.5% rate confirmed live on merchant-dev's
  // own Pricing page and in the real transaction data.
  aaloChargeMapping: {
    configurationType: 'Flat X%',
    chargeType: 'TRANSPAY_CHARGE',
    isActive: 'Active',
    otherCharge: '', // empty — Aalo has no Other Charge configured
    rateChargeType: 'PERCENTAGE',
    chargeAmount: '0.5',
    discountAmountType: 'FLAT',
    discountAmount: '0',
  },

  // EMI Activation (`/transpay-emi/emi-activation`): confirmed live
  // that only this one internal test account has EMI activated at all,
  // across all 5 supported banks — no real merchant uses EMI.
  onlyEmiActivatedMerchant: {
    transpayId: 'm134',
    name: 'transpaycoretest',
    paymentInstrumentNames: 'UCBL,Southeast Bank,Brac Bank,Eastern Bank,AB Bank',
  },
};
