# TransPay Automation Framework

Scalable Playwright + Page Object Model framework for the TransPay
**Merchant Onboarding** wizard (`tests/merchant`) — the "Become a Merchant"
flow at `https://merchant-dev.softbd.xyz/onboarding`.

## Structure

```
config/            Centralized environment/config loader (reads .env once)
pages/
  base/             BasePage — shared navigation + search-dropdown helpers
  merchant/         MerchantBasePage + one page object per wizard step
fixtures/           Custom Playwright fixtures (auto-instantiate page objects)
data/               Static/seed test data (+ placeholder upload assets)
utils/              Framework-agnostic helpers (unique email/name generators)
tests/
  merchant/
playwright.config.js Production-level config: retries, timeouts, trace/video/
                      screenshot capture, multi-browser projects
```

## Setup

```powershell
npm install
npx playwright install --with-deps
```

Configuration lives in `.env` (see `.env.example`). Key variables:

| Variable | Purpose |
|---|---|
| `BASE_URL` | Merchant onboarding site |
| `MERCHANT_MOBILE_NUMBER` | QA mobile number for the onboarding flow — **a one-shot resource, see below** |

## Running tests

```powershell
npm test                 # everything, all browsers
npm run test:merchant    # Merchant Onboarding suite
npm run test:smoke       # tests tagged @smoke
npm run test:headed      # see the browser
npm run test:ui          # Playwright's interactive UI mode
npm run report           # open the last HTML report
```

## Cloudflare Turnstile on mobile verification

The "Verify your mobile number" screen renders a **Cloudflare Turnstile**
challenge (`#cf-turnstile`) the moment a mobile number is typed, and "Send
OTP" stays disabled until it passes. This framework **never** attempts to
solve or click through the widget itself. In practice:

- In a **real, non-automated Chrome session**, Turnstile passes invisibly
  in ~1–2s (confirmed manually) — no checkbox ever appears.
- In **Playwright's automated Chromium**, Turnstile detects the automation
  and fails (`Turnstile error 300010`), so "Send OTP" never enables —
  confirmed in **both headless and headed (`--headed`) mode**, so this
  isn't a rendering-mode thing, Playwright's Chromium itself is fingerprinted
  regardless. `VerifyMobileOtpPage.waitForMobileNumberAccepted()` detects
  this and reports `blockedByCaptcha: true` instead of hanging or failing
  hard.

**Dev OTP shortcut:** the `merchant-dev` backend's `/api/auth/otp/send`
response includes a `devOtp` field (e.g. `{"devOtp":"247903", ...}`) — a
QA convenience specific to this dev environment, not a security bypass.
`VerifyMobileOtpPage.requestOtp()` / `.loginWithDevOtp()` capture it via
`page.waitForResponse`, so whenever Turnstile *does* let "Send OTP" through
(real browser only — see above), the whole wizard can be driven without an
SMS inbox. The full-wizard test in `tests/merchant/merchantOnboarding.spec.js`
`test.skip()`s itself automatically when `blockedByCaptcha` is true, so CI
stays green under Playwright without masking a real failure. Getting
Playwright itself past Turnstile would need the dev team to provide a test
sitekey, an allow-listed QA number, or a stub OTP — not something achievable
from the test framework side.

All 8 steps (Merchant Type → Review Registration) were walked field-by-field
against the live site using this shortcut, and the page objects in
`pages/merchant/*.js` reflect the real markup — except the optional
Finance/Technology/Other contact sections on Contact Persons, which were
never expanded and are still `TODO: unverified`.

## Full submission coverage — and the one-shot mobile number

The full-wizard test accepts terms and clicks **Submit Registration** for
real. It's been run end-to-end several times on 2026-11-24, each with a
fresh `MERCHANT_MOBILE_NUMBER`, producing genuine applications every time
— most recently `MERCHANT_MOBILE_NUMBER=01686687277` → **TP-2026-000096**,
status "Awaiting review". `merchantTestData.js` holds exactly the data that
was accepted (earlier runs this same day also produced TP-2026-000094 and
-000095, now both consumed too).

This has one consequence worth knowing: **a merchant-dev mobile number can
only complete the wizard once.** Logging in with a number that already has
an application skips the wizard entirely and lands on the same status
screen (`ApplicationStatusPage`) instead — the same thing happens with any
previously-used number (e.g. `01867742596`, which is already an *approved*
merchant, "Md. Tanvir Rahaman"). The full-wizard test detects this via
`applicationStatusPage.hasExistingApplication()` and skips itself with a
clear message rather than failing on missing wizard fields.

Practical effect: re-running the suite against the same
`MERCHANT_MOBILE_NUMBER` will only pass the first time; every run after
that just confirms the skip-detection works. To get real "fresh wizard"
coverage again, point `MERCHANT_MOBILE_NUMBER` at a number that has never
been used on merchant-dev. For repeatable CI coverage of the submission
path (rather than a one-off), consider generating a new number per run
(see `utils/dataGenerator.js` for the pattern already used for emails) —
flagged here as a recommendation, not yet implemented, since it would mean
every CI run creates a new real application in the dev backend.

## Already-registered / application status coverage

`tests/merchant/applicationStatus.spec.js` turns the one-shot-number
behaviour above into deliberate coverage instead of an accident: it logs
in with two real, already-consumed numbers from
`merchantTestData.registeredMobileNumbers` and asserts the resulting
`ApplicationStatusPage` directly —

- **Awaiting review** (`01686687277` → `TP-2026-000096`):
  `hasExistingApplication()` and `isAwaitingReview()` are true,
  `isApproved()` is false, and the ID/status match exactly.
- **Approved** (`01867742596` → `TP-2026-000023`, "Md. Tanvir Rahaman"):
  the same checks the other way around, plus a visible "Go to Dashboard"
  link, which only an approved merchant gets.

This also fixed a real bug: `ApplicationStatusPage` used to call the
approved-only check `isAlreadyRegistered()`, so an awaiting-review number
would **not** have been recognised as already registered — the full-wizard
test happened to never hit that path because Turnstile already blocks it
first in headless CI, but it was wrong. `hasExistingApplication()` now
checks for either status, and `isApproved()` / `isAwaitingReview()` exist
for asserting the specific one.

## See also

See the feedback list delivered alongside this framework for a full list of
pre-existing bugs that were fixed and other recommendations.
