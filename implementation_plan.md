# TrafficExchange – Complete Unfinished Tasks

## Summary

The project has a working NestJS backend and Next.js frontend, but almost all backend test files are stubs (just `should be defined` with no real mocks or assertions). Several modules (campaigns, analytics, traffic, billing, admin) have zero test files. This plan covers 5 focused issues, each in its own branch.

## Issues Found

| # | Title | Branch |
|---|-------|--------|
| 1 | Stub unit tests – auth, users, websites | `fix/1-unit-tests-auth-users-websites` |
| 2 | Missing tests – campaigns, analytics, traffic, billing, admin | `fix/2-unit-tests-campaigns-analytics-traffic-billing` |
| 3 | [app.controller.spec.ts](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/app.controller.spec.ts) compiles but needs AppService provided properly | `fix/3-appcontroller-fix` |
| 4 | Backend [main.ts](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/main.ts) – `forbidNonWhitelisted: false` should be `true` for strict validation | `fix/4-validation-strictness` |
| 5 | Visual browser test of all key UI flows | `fix/5-visual-browser-test` |

---

## Proposed Changes

### Issue #1 – Stub unit tests for auth, users, websites
**Branch**: `fix/1-unit-tests-auth-users-websites`

#### [MODIFY] [auth.service.spec.ts](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/auth/auth.service.spec.ts)
Replace the stub with full mocks. Test:
- [register()](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/auth/auth.controller.ts#10-13) → calls `usersService.create` and `jwtService.signAsync`, returns tokens
- [login()](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/auth/auth.service.ts#28-45) → throws on bad password, throws on inactive user, returns tokens on success

#### [MODIFY] [auth.controller.spec.ts](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/auth/auth.controller.spec.ts)
Mock [AuthService](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/auth/auth.service.ts#7-58). Test [register](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/auth/auth.controller.ts#10-13) and [login](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/auth/auth.service.ts#28-45) endpoints.

#### [MODIFY] [users.service.spec.ts](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/users/users.service.spec.ts)
Mock TypeORM Repository. Test [create](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/campaigns/campaigns.controller.ts#12-15), [findByEmail](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/users/users.service.ts#24-27), [findById](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/users/users.service.ts#28-31), [updateProfile](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/users/users.service.ts#32-50).

#### [MODIFY] [users.controller.spec.ts](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/users/users.controller.spec.ts)
Mock [UsersService](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/users/users.service.ts#8-51). Test [getMe](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/users/users.controller.ts#20-26) and [updateMe](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/users/users.controller.ts#28-31).

#### [MODIFY] [websites.service.spec.ts](file:///g:/Development/Website/Landing\TrafficExchange/backend/src/websites/websites.service.spec.ts)
Mock Repository + UsersService. Test [create](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/campaigns/campaigns.controller.ts#12-15), [findAllForUser](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/campaigns/campaigns.service.ts#107-114), [findOne](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/websites/websites.service.ts#34-41), [remove](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/websites/websites.service.ts#50-54).

#### [MODIFY] [websites.controller.spec.ts](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/websites/websites.controller.spec.ts)
Mock [WebsitesService](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/websites/websites.service.ts#8-55). Test all controller methods.

---

### Issue #2 – Missing tests for campaigns, analytics, traffic, billing, admin
**Branch**: `fix/2-unit-tests-campaigns-analytics-traffic-billing`

#### [NEW] campaigns.service.spec.ts
Mock all repositories + DataSource/QueryRunner. Test:
- [create()](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/campaigns/campaigns.controller.ts#12-15) – insufficient credits throws, website not found throws, happy path deducts credits and creates campaign
- [findAllForUser()](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/campaigns/campaigns.service.ts#107-114) – returns campaigns for user
- [pauseCampaign()](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/campaigns/campaigns.service.ts#115-128) / [resumeCampaign()](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/campaigns/campaigns.service.ts#129-142) – correct status transitions

#### [NEW] analytics.service.spec.ts
Mock repositories. Test [getUserDashboardStats()](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/analytics/analytics.service.ts#19-53) returns correct aggregated data.

#### [NEW] traffic.service.spec.ts
Mock repos + DataSource. Test [findWebsiteForUser()](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/traffic/traffic.service.ts#24-63) and [verifySessionAndAwardCredit()](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/traffic/traffic.service.ts#64-146).

#### [NEW] billing.service.spec.ts
Mock repos + DataSource. Test [getActivePackages](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/billing/billing.service.ts#21-24), [createPaymentIntent](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/billing/billing.service.ts#32-57), [confirmPaymentPlaceholder](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/billing/billing.service.ts#58-111).

#### [NEW] admin.service.spec.ts
Mock repos. Test [getAllUsers](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/admin/admin.service.ts#22-25), [suspendUser](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/admin/admin.service.ts#26-36), [getPendingWebsites](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/admin/admin.service.ts#37-43), [approveWebsite](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/admin/admin.service.ts#44-53), [rejectWebsite](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/admin/admin.service.ts#54-63).

---

### Issue #3 – Fix app.controller.spec.ts
**Branch**: `fix/3-appcontroller-fix`

#### [MODIFY] [app.controller.spec.ts](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/app.controller.spec.ts)
The existing test already supplies [AppService](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/app.service.ts#3-9) as a real provider — this is actually correct. The test will pass as-is once all other module conflicts are resolved. Verify it still returns `"Hello World!"`.

---

### Issue #4 – Strict validation in main.ts
**Branch**: `fix/4-validation-strictness`

#### [MODIFY] [main.ts](file:///g:/Development/Website/Landing/TrafficExchange/backend/src/main.ts)
Change `forbidNonWhitelisted: false` → `true` so requests with unknown properties are rejected.

---

### Issue #5 – Visual browser test (no code changes)
**Branch**: `fix/5-visual-browser-test`
Run the frontend dev server + a local mock API, then use the browser tool to verify:
- Landing page (`/`) renders
- Login (`/login`) submits and redirects to dashboard
- Dashboard metrics show
- Earn page loads and toggles surfing
- Spend/Campaigns page creates campaign form
- Analytics, Settings, Billing pages load without JS errors

---

## Verification Plan

### Automated Tests

```bash
# Run from backend directory
cd g:\Development\Website\Landing\TrafficExchange\backend
npm test
```

Expected: All spec files pass. Coverage includes auth, users, websites, campaigns, analytics, traffic, billing, admin.

```bash
# Coverage report
npm run test:cov
```

### Manual / Browser Verification

After frontend dev server is up:
```bash
cd g:\Development\Website\Landing\TrafficExchange\frontend
npm run dev
```
Use the browser_subagent to visually navigate:
1. `/` – landing page
2. `/login` – login with test credentials
3. `/dashboard` – metrics load
4. `/earn` – start surfing button works
5. `/spend` – campaign form renders
6. `/analytics`, `/settings`, `/billing` – no JS errors
