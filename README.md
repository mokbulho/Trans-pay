# TransPay Automation Framework

Scalable Playwright + Page Object Model framework for TransPay:

- **Merchant Onboarding** wizard (`tests/merchant`) — the "Become a
  Merchant" flow at `https://merchant-dev.softbd.xyz/onboarding`.
- **Admin Console** (`tests/admin`) — the Merchant Management → Applications
  approval workflow at `https://merchant-dev.softbd.xyz/admin`.

## Structure

```
config/            Centralized environment/config loader (reads .env once)
pages/
  base/             BasePage — shared navigation + search-dropdown helpers
  merchant/         MerchantBasePage + one page object per wizard step
  admin/            Admin login + Applications list/dialogs/pricing page objects
fixtures/           Custom Playwright fixtures (auto-instantiate page objects)
data/               Static/seed test data (+ placeholder upload assets)
utils/              Framework-agnostic helpers (unique email/name generators)
tests/
  merchant/
  admin/
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
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Shared Admin Console test account (see "Admin Console" below) |

## Running tests

```powershell
npm test                 # everything, all browsers
npm run test:merchant    # Merchant Onboarding suite
npm run test:admin       # Admin Console suite
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

## Bulk data-driven onboarding

`tests/merchant/merchantOnboardingbulkdata.spec.js` runs the same full
8-step wizard once per row of a bulk data file instead of one hand-written
merchant — `utils/bulkDataReader.js` loads `.json` or `.csv` natively (see
`data/merchant/bulkMerchants.json` / `.csv` for the example data, same
columns either way), or `.xlsx` if you `npm install xlsx` yourself (not a
hard dependency here — see the npm audit note below on why). Point
`BULK_DATA_FILE` at your own file to use it instead of the bundled example.
Every row uses the same shared upload assets (`data/merchant/assets/*.png`)
since a flat data file isn't a practical place to carry real images.

The 3 example rows have been run for real against merchant-dev
(2026-11-24): Rahim General Store (`01890001111`) → `TP-2026-000097`,
Karim Fashion House (`01890002222`) → `TP-2026-000098`, Sultana Food
Corner (`01890003333`) → `TP-2026-000099`. All three numbers are now
consumed, same one-shot caveat as everywhere else in this README — point
`bulkMerchants.json`/`.csv` at fresh, never-used numbers to exercise the
wizard again. And like every other test here, each row still needs
Turnstile to let "Send OTP" through, which Playwright itself never gets
past (see above) — so right now every row cleanly `test.skip()`s instead
of failing (either on `blockedByCaptcha`, or on the already-registered
guard once a number is consumed).

```powershell
npm run test:bulk                                   # bundled example data
$env:BULK_DATA_FILE="path/to/your-file.csv"; npx playwright test tests/merchant/merchantOnboardingbulkdata.spec.js
```

## Admin Console (Merchant Management → Applications)

`tests/admin/adminMerchantApproval.spec.js` covers the admin approval
workflow: log in → Applications list (Pending/Approved/All tabs) → view a
pending application's details → **Approve** (Domain, Allowed IPs,
Settlement cycle, then a one-time API/Webhook secrets dialog) or
**Reject** (reason required) → Approved tab → per-merchant Pricing page.
Page objects live in `pages/admin/`, fixtures in `fixtures/admin.fixtures.js`,
targets in `data/admin/adminTestData.js`.

**The shared `/login` screen is also behind Cloudflare Turnstile** — same
mechanism as the merchant onboarding wizard's mobile verification step
(see above), confirmed with a direct 40-second headless Playwright probe:
the Turnstile token never resolved and the "Sign in" button never enabled.
A real, non-automated Chrome session passes it invisibly in ~3s instead.
`AdminLoginPage.login()` waits up to 10s for "Sign in" to enable and
returns `{ blockedByCaptcha }` instead of clicking a disabled button; every
test in this suite skips itself on that flag rather than failing, so it
reports `5 skipped` (never fails) under Playwright/CI.

What was verified for real this session through a non-automated browser:
Approved "Sultana Food Corner" (domain + IP `180.148.212.90` + 7-day
settlement cycle) — now Active, merchant code `sultana_food_corner`.
Rejected "Karim Fashion House" with a reason — now shows "Rejected".
`approveTarget` / `rejectTarget` in `adminTestData.js` point at Pending
merchants from the bulk-data run that haven't been decided yet; each test
also checks the merchant's current status first and skips itself if it's
already been approved/rejected, instead of failing on a missing Pending row.

The Pricing page object (`MerchantPricingPage.js`) confirms the navigation
into `/admin/merchants/:id/pricing` lands correctly; its instrument-enable,
merchant-wise-rate and hierarchy sections are covered in depth by the
Charge distribution spec below instead of here.

```powershell
npm run test:admin
```

## Charge distribution

`tests/admin/chargeDistribution.spec.js` tests the business rules from a
bank-provided spec, `TP_Charge_Distribution_Scenarios.xlsx` (Parameters /
Scenarios / Negative_Scenarios / Rules_Legend sheets), against what the
live platform actually implements. The spreadsheet models a single charge
split **proportionally by weight** across up to 5 parties — PI (Payment
Instrument), TP (Transpay gateway, always paid), SM (Super Merchant), M
(Merchant), V (Vendor) — e.g. "PI+TP active → PI gets 6%, TP gets 4%",
32 positive scenarios (16 party combinations × Inbound/Outbound) plus 10
negative/invalid cases.

**Confirmed live (2026-11-24): the real model is a markup/spread, not a
proportional split of one total charge.** There is no endpoint that takes
"which parties are active" and returns a 5-way percentage split summing to
100%. Instead, per merchant (`/admin/merchants/:id/pricing`):

| Spreadsheet entity | What's actually live |
|---|---|
| **PI** | The instrument's own rate — global in the read-only Rate Catalogue (`/admin/charges`), optionally overridden per merchant in "Payment instruments" |
| **TP** | "Merchant wise rate" — Transpay's own cut, added on top of the instrument charge (always configurable, matching Condition 1) |
| **V** | The same "Merchant wise rate" form's "Other Charge" (an amount or a percentage) — confirmed on the Vendors page ("Vendors... can take a merchant's Other Charge") |
| **SM** | A Super merchant / Sub-merchant **hierarchy**, not a revenue share — a sub-merchant's combined rate (instrument + merchant wise rate) must never be less than its super merchant's, enforced server-side and by the "Super merchant pricing check" tool on the Applications list |
| **M** | Not a separate rate — the merchant simply receives `amount − totalCharge` |

This was found by reading the real endpoints behind the Pricing page
(`core-merchant/rate-config`, `core-merchant/platform-charge`) and
testing the "Merchant wise rate" form directly — an empty draft with no
side effects. Two negative-input validations were confirmed for real
through the actual form, not guessed: a negative percentage is rejected
with *"The percentage cannot be negative"*, and one over 100 with *"The
percentage cannot exceed 100"* (both server-side, HTTP 400 — the client's
own live preview doesn't warn first, so these are UI-driven assertions on
purpose, not raw API calls). The Condition-3 "parts sum to the whole"
check is verified arithmetically against a real, already-configured
merchant (Michael Madhusudan College, a sub-merchant "Under Aalo"):
Bill ৳1,000 + merchant wise rate ৳20 + Other Charge ৳10 + instrument
charge ৳15.35 = Payer pays ৳1,045.35.

```powershell
npx playwright test tests/admin/chargeDistribution.spec.js
```

## Merchant lifecycle (Approved-list row actions)

`tests/admin/merchantLifecycle.spec.js` covers the rest of an Approved
row's "⋮" menu, confirmed live (2026-11-24) to have up to 8 items: View
application, Attach/Change super merchant, Vendors & Other Charge,
Pricing & rates (the Charge distribution Pricing page above), Edit on
the core platform, Rotate API secret, Rotate webhook secret, Disable on
the core platform.

**"Make payment" doesn't exist in the Admin Console** — checked in every
plausible place (the row menu, the merchant's Pricing page, the
Transactions page) before and after enabling an instrument and setting a
rate on a test merchant. It turned out to live on an entirely separate
site instead — see "Make payment" below.

Real actions performed for real against Sultana Food Corner this
session, not just opened and cancelled:
- **Attached it as a sub-merchant of Aalo** (explicit request) via
  "Attach to a super merchant" → search → select Aalo → Review attach →
  Confirm. Aalo now earns commission on its payments and takes its
  Other Charge, confirmed on the Vendors & Other Charge dialog
  ("waits until it is detached").
- **Rotated its API secret and webhook secret** through the real
  "Copy these secrets now" dialog (shared with the approval flow's
  secrets dialog — see `ApiSecretsDialog.js`). Rotation is designed to
  be repeatable, so the spec rotates them again on every run.
- **Round-tripped its Address** on "Edit on the core platform" (edited,
  saved, reverted, saved) — confirms both the save flow and its History
  tab's before → after audit trail ("Secrets are never recorded" there).

**Deliberately never confirmed for real: "Disable on the core
platform."** Its own row-menu description says *"Stop the merchant
taking payments. Nothing is deleted and it can be re-enabled,"* but the
actual confirmation dialog is titled **"Reject this merchant on the core
platform?"** and warns the merchant *"will not be able to authenticate
until re-approved"* — materially stronger than the menu copy, and
Sultana Food Corner's Active status is relied on by the rest of this
suite. The test opens the dialog, asserts its real title and copy, and
only ever clicks Cancel.

```powershell
npx playwright test tests/admin/merchantLifecycle.spec.js
```

## Make payment

The real "Make payment" feature doesn't live in the Admin Console at
all — it's a separate site, a test-merchant checkout tool at
`https://testmerchant-transpay.softbd.xyz`, covered by
`tests/payment/makePayment.spec.js`. **Unlike every other suite here,
none of this site — nor the real Transpay gateway checkout, nor the TP
Sandbox PG simulator — is behind Cloudflare Turnstile or needs a
sign-in, so this suite runs for real under Playwright and actually
passes, instead of skipping.**

The flow, confirmed live (2026-11-24) end to end:

1. **Merchant settings** (`/settings`) lists merchant "profiles" — each
   one a saved set of core-platform credentials — with Activate / Test
   login / Edit / Delete, and a "Paying as X (Y)" banner naming the
   currently active one. **New payments always use the active profile.**
2. **Pay** (`/`) is the plain customer-facing checkout form (Amount,
   Full name, Mobile number, optional Email) that starts a real payment
   against that active profile.
3. It redirects to the **real Transpay gateway checkout**
   (`transpay.dev.transpay.com.bd/transpaypg/checkout`) — Mobile
   Banking / Cards / Net Banking tabs, one tile per instrument *enabled
   for that merchant in Admin's Pricing page* (confirmed: an instrument
   not enabled there doesn't appear here at all).
4. Selecting `TP_SANDBOX_PG` redirects to the **TP Sandbox PG
   simulator**, clearly labelled "SIMULATOR · NOT A BANK — nothing here
   reaches a bank and no money moves." It gates its Pay-as-SUCCESS /
   Fail / Cancel buttons behind a shared, per-environment "Simulated
   authorisation" PIN (`tp_sandbox_pg.pin`, `environment.sandboxSettlePin`)
   — its own copy says plainly this is *"not a bank credential, and not
   proof anyone authenticated,"* just a guard against a bare link
   triggering a settle. A wrong PIN doesn't fail the test outright — it
   shows *"Wrong PIN — attempt N of 10"* and lets you correct it on the
   same page (confirmed and covered by its own test).
5. Settling as SUCCESS lands on a plain status page naming the
   transaction id — which was confirmed to also show up immediately in
   Admin's Transactions ledger once "Fetch new" is clicked there.

**One-time setup done by hand, not by this suite** (see
`data/testMerchant/testMerchantData.js`): Rahim General Store
(`rahim_general_store`) — approved, a sub-merchant of Aalo — was given
Payment instruments (ROCKET, TP_SANDBOX_PG) and a merchant wise rate in
Admin (the business-rule precondition this feature was asked for:
*"before make payment set the charges rate of the merchant and the
payment gateway"*), then registered as a profile on the test-merchant
tool using an API secret / webhook secret rotated for real from Admin's
Rotate API secret / Rotate webhook secret dialogs, and left active.
Those secrets are never re-entered by the automated suite — the saved
profile persists on that tool between runs.

**A real concurrency bug worth knowing about**: these tests share one
mutable piece of *external* state — the test-merchant tool's single
active-profile setting, which isn't scoped per Playwright browser
context the way cookies are — so running them in parallel let two
payments race against each other. The spec runs this describe block in
serial mode (`test.describe.configure({ mode: 'serial' })`) to avoid it.
Separately, the gateway itself rejects a customer name containing a
hyphen (*"Customer name may contain only letters, digits, spaces and
full stops"*) — found live when a first draft of the wrong-PIN test
used "QA Wrong-PIN Retry Test" as the name.

```powershell
npm run test:payment
```

## Vendor management

Merchant Management → **Vendors** (`/admin/vendors`), covered by
`tests/admin/vendorManagement.spec.js`. A vendor is the entity a
merchant's "Other Charge" can be redirected to pay instead of the
merchant itself (see "Charge distribution" above) — distinct from a
*super merchant*, which absorbs the whole Merchant Wise Rate too, not
just the Other Charge.

The full journey, confirmed live (2026-11-25) end to end by creating two
real vendors — `VND-00000003` "SoftBD Ltd" (kept for real) and
`VND-00000004` "QA Vendor Explorer Co" (a throwaway, approved then
detached again to confirm selectors with no lasting side effect):

1. **Onboard**: "+ New vendor" creates a Draft and redirects straight to
   its 4-step wizard (Personal Information → Business Information →
   Primary Contact → Bank Details), all on one URL — an SPA step
   switcher, not separate pages. Steps 1–3 save with "Save & continue";
   saving step 4 reads **"Save & submit for approval"** and submits the
   vendor for admin review in the same action.
2. **Approve**: the Decision panel's Approve dialog lists *only
   approved merchants with no super merchant* ("they own their Other
   Charge") as an optional checkbox list — merchants can be attached
   later instead. Approving without picking anyone still works.
3. **Attach**: approving with a merchant ticked attaches it immediately,
   but **does not by itself grant the payout** — the Merchants table's
   "Other Charge Paid To" column still reads "The merchant" until a
   separate step changes it.
4. **Assign**: a row's "Pay Other Charge to this vendor" /
   "Pay Other Charge to merchant" toggle is that separate step, and
   needs a required Reason ("kept in the history").
5. **Detach**: also needs a required reason; "Not attached to any
   merchant." is the empty state once the only relationship is removed.

**A real cross-vendor scheduling rule, confirmed live — important for
anyone extending this suite**: a merchant can only ever pay its Other
Charge to one vendor *as of any given day*. Scheduling a **second**
vendor to receive it cannot take effect "now" if another vendor already
holds that route today — the dialog's own copy names the next free day
("*The earliest day is ... — the route before this one starts ...*").
Attaching a second vendor is harmless by itself; only *confirming* the
payout toggle schedules a real override. The full-journey test
deliberately opens this dialog against Aalo (which already pays
`VND-00000003` for real, from the live walkthrough above) only to
assert that conflict-aware copy, and never confirms it — then detaches,
so every run leaves Aalo's real payout to `VND-00000003` untouched.

Also confirmed live: Mobile Number on Personal Information is hinted
*"Unique to this vendor"* — the full-journey test generates a fresh one
per run (`utils/dataGenerator.js`'s `uniqueMobileNumber()`), the same
reason Business Name is generated too.

```powershell
npx playwright test tests/admin/vendorManagement.spec.js
```

## See also

See the feedback list delivered alongside this framework for a full list of
pre-existing bugs that were fixed and other recommendations.
