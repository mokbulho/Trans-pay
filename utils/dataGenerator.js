// @ts-check

/**
 * Small, dependency-free data generators for form-heavy specs
 * (e.g. unique emails/business names per test run so re-runs
 * against a shared staging environment don't collide).
 */

function randomDigits(length) {
  let out = '';
  for (let i = 0; i < length; i += 1) out += Math.floor(Math.random() * 10);
  return out;
}

function uniqueSuffix() {
  return `${Date.now()}${randomDigits(3)}`;
}

/** @param {string} prefix */
function uniqueEmail(prefix = 'qa') {
  return `${prefix}.${uniqueSuffix()}@example.com`;
}

/** @param {string} prefix */
function uniqueBusinessName(prefix = 'QA Test Store') {
  return `${prefix} ${uniqueSuffix()}`;
}

module.exports = { randomDigits, uniqueSuffix, uniqueEmail, uniqueBusinessName };
