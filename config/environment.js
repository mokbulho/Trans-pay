// @ts-check
require('dotenv').config();

/**
 * Centralized environment/config loader.
 * Add new environment variables here instead of reading process.env
 * directly from pages/tests, so there is a single source of truth.
 */
const environment = {
  baseURL: process.env.BASE_URL || 'https://merchant-dev.softbd.xyz/',

  merchantMobileNumber: process.env.MERCHANT_MOBILE_NUMBER || '01686687277',
  headless: process.env.HEADLESS ? process.env.HEADLESS === 'true' : true,
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT) || 30_000,

  // Admin console (merchant-dev shared test account — see README).
  adminEmail: process.env.ADMIN_EMAIL || 'admin@transpay.com.bd',
  adminPassword: process.env.ADMIN_PASSWORD || 'password',

  // Test-merchant checkout tool (a separate site from the admin console
  // and the merchant onboarding wizard — see README "Make payment").
  testMerchantBaseUrl: process.env.TEST_MERCHANT_BASE_URL || 'https://testmerchant-transpay.softbd.xyz',
  // The TP Sandbox PG simulator's shared settle PIN (tp_sandbox_pg.pin).
  // Confirmed NOT a bank credential — the simulator's own copy says so
  // ("not proof anyone authenticated... stops a settle being triggered
  // by a bare link"); it only gates the simulator's 3 outcome buttons.
  sandboxSettlePin: process.env.SANDBOX_SETTLE_PIN || '730914',

  // Core platform admin console (admin.dev.transpay.com.bd) — a separate
  // site/login from the merchant-dev Admin Console above. Confirmed live
  // (2026-11-25): its /login screen has no Cloudflare Turnstile, so unlike
  // AdminLoginPage this one is expected to pass under Playwright for real.
  coreAdminBaseUrl: process.env.CORE_ADMIN_BASE_URL || 'https://admin.dev.transpay.com.bd',
  coreAdminUsername: process.env.CORE_ADMIN_USERNAME || 'admin',
  coreAdminPassword: process.env.CORE_ADMIN_PASSWORD || 'admin123',
};

module.exports = { environment };
