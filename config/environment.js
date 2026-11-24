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
};

module.exports = { environment };
