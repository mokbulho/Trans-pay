// @ts-check
const { test, expect } = require('../../fixtures/core-admin.fixtures');

/**
 * Core platform admin console — sign-in (`/login`).
 *
 * Unlike merchant-dev's Admin Console (see `tests/admin/*`), this
 * login has **no Cloudflare Turnstile** — confirmed live (2026-11-25)
 * via a real, non-automated browser session showing a plain
 * Username/Password form with no challenge widget, and now confirmed
 * again here under Playwright itself: this test logs in for real and
 * does not skip.
 */
test.describe('Core admin — sign in', () => {
  test('admin can log in and reach the Admin Dashboard @smoke', async ({ coreAdminLoginPage, page }) => {
    await coreAdminLoginPage.login();

    await expect(page).toHaveURL(/\/dashboard\/admin$/);
    await expect(page.getByRole('heading', { name: 'Transpay Admin Dashboard' })).toBeVisible();
  });
});
