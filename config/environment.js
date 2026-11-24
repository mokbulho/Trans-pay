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
};

module.exports = { environment };
