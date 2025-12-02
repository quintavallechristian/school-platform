# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands and Development Workflow

### Install and Setup
- Install dependencies:
  - `pnpm install`
- Configure env vars:
  - `cp .env.example .env` and update `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, optional email/R2 keys.
- Generate Payload/TypeScript types (required before build/tests if schema changed):
  - `pnpm generate:types` (alias for `npm run generate:types` in README)
- (Optional but recommended) generate Payload import map (needed when adding admin components):
  - `pnpm generate:importmap`

### Running the app
- Development server (Next + Payload):
  - `pnpm dev`
- Clean dev server when `.next` is corrupted or config changed heavily:
  - `pnpm devsafe`
- Production build and run:
  - `pnpm build`
  - `pnpm start`

### Linting
- Run Next/ESLint linting:
  - `pnpm lint`

### Tests
All tests assume a running MongoDB and valid `.env`.

- Run full test suite:
  - `pnpm test` (runs integration + e2e)
- Integration tests (Vitest, Payload API):
  - `pnpm test:int`
  - Single integration test file:
    - `pnpm test:int -- tests/int/api.int.spec.ts`
  - Filter by test name:
    - `pnpm test:int -- -t "fetches users"`
- E2E tests (Playwright, frontend):
  - `pnpm test:e2e`
  - Single E2E spec:
    - `pnpm test:e2e -- tests/e2e/frontend.e2e.spec.ts`
  - Single E2E test by title:
    - `pnpm test:e2e -- -g "can go on homepage"`
- Accessibility checks (custom script against running app):
  - `pnpm test:accessibility`

### Data Migration / Maintenance Scripts
Scripts expect a configured database and appropriate data.

- Migrate existing users to multiple schools (multi-tenant upgrade):
  - `pnpm migrate:schools`
- Fix users missing associated schools:
  - `pnpm fix:users-no-schools`

## High-Level Architecture

### Stack Overview
- **Next.js 15 / App Router** in `src/app` for both marketing/tenant frontend and Payload admin shell.
- **Payload CMS 3.x** configured in `src/payload.config.ts` with MongoDB (`@payloadcms/db-mongodb`) and S3/R2 media storage (`@payloadcms/storage-s3` with R2 credentials).
- **MongoDB** as multi-tenant backing store.
- **TypeScript** everywhere, with generated `src/payload-types.ts` from Payload.

### Multi-tenant Domain Model
Key collections are defined in `src/collections` and wired in `src/payload.config.ts`:
- `Schools`: tenant entity (one per school) with:
  - Branding (logo, theme colors, optional domain) and `featureVisibility` flags.
  - Active flag (`isActive`) controlling visibility.
- `Users`: global user pool with:
  - `role` (`super-admin`, `school-admin`, `editor`, `viewer`).
  - `schools` relationship (can be multiple) describing which tenants they belong to.
- Content collections (e.g. `Articles`, `Events`, `Projects`, `EducationalOfferings`, `Teachers`, `Menu`, `Communications`, `Gallery`, `Homepage`, `ChiSiamo`, `PrivacyPolicy`, `CalendarDays`, etc.) all:
  - Include a `school` relationship field.
  - Are filtered/enforced by shared access utilities (`tenantRead`, `tenantCreate`, `tenantUpdate`, `tenantDelete`).

The net effect:
- Super admins see/manage all tenants and content.
- School admins/editors see and mutate only content whose `school` matches one of their assigned schools.
- Frontend readers are either fully public for some collections (e.g. media/documents) or filtered by school and activity/visibility flags.

### Access Control and Tenant Enforcement
Centralized in `src/lib/access.ts`:
- Role helpers: `isSuperAdmin`, `isSchoolAdminOrAbove`, `canEdit`.
- Query-based access filters:
  - `tenantRead`, `tenantUpdate`, `tenantDelete`, `mediaRead`, `publicRead` — all return Payload access objects that constrain queries by `school` membership or allow global read for unauthenticated users where appropriate.
- Creation/update hooks:
  - `assignSchoolBeforeChange` automatically assigns the `school` field for non–super-admin users on create, and validates that updates do not move content to a school the user does not control.
- Admin UI helpers:
  - `getSchoolField` returns a preconfigured `relationship` field definition for `school`, with `filterOptions` and `admin.condition` so that:
    - Super admins can pick any school.
    - School admins/editors with exactly one school don’t see the field (auto-assigned).
    - Options are always limited to the user’s schools.
- Feature visibility:
  - `isFeatureEnabledForUser` uses the `Schools` collection’s `featureVisibility` flags to hide collections from the admin sidebar when a feature is disabled for the user’s current school.

Collections should reuse these helpers rather than reimplementing role logic locally.

### Frontend Multi-tenant Resolution
Utilities in `src/lib/school.ts` encapsulate how the public frontend resolves and queries per-school content:
- `getCurrentSchool(slug?)`:
  - If a `slug` is passed, look up an active school by slug.
  - Otherwise infer the school from the request’s `Host` header using either `domain` or subdomain-as-slug.
- Content fetchers scoped by `schoolId` (all call `getPayload` with `@payload-config`):
  - `getSchoolArticles`, `getSchoolEvents`, `getSchoolProjects`, `getSchoolEducationalOfferings`, `getSchoolCommunications`, `getSchoolActiveMenu`, `getSchoolTeachers`, `getSchoolTestimonials`, `getSchoolCalendarDays`, `getSchoolHomepage`, `getSchoolChiSiamo`, `getSchoolPrivacyPolicy`, etc.
  - Per-entity fetch helpers (`getSchoolArticle`, `getSchoolPage`, `getSchoolEvent`, `getSchoolProject`, `getSchoolEducationalOffering` and their `*ById` aliases).
- Feature flags on the frontend:
  - `isFeatureEnabled` and `getEnabledFeatures` read `School.featureVisibility` to decide which navigation items/sections to show for a given school.

Use these helpers instead of open-ended `payload.find` calls in new frontend code to ensure consistent tenant scoping.

### Next.js App Layout and Shared UI
- Root frontend layout: `src/app/(frontend)/layout.tsx`
  - Registers global styles, theme provider, Aurora background, cookie banner, and toaster.
  - Uses `getPayload` + `cookies()` to resolve the current admin user from the `payload-token` cookie.
  - Extracts `x-pathname` from headers to decide when to show `ConditionalGenericNavbar` (e.g. hide it on school-specific routes).
- Main marketing/landing page: `src/app/(frontend)/page.tsx`
  - Uses `Hero`, `FeaturesSection`, `PricingSection`, `TestimonialsSection`, and `LandingFooter` to present the SaaS landing and pricing.
- Shared components live under `src/components` and are generally split by domain (Navbar, Hero, LandingPage, CookieBanner, School-specific fields, PageBlocks, etc.).
  - Page blocks / rich content: `src/components/PageBlocks/*`, `src/lib/blocks.ts`, and related docs (`BLOCKS_GUIDE.md`, `PAGES_GUIDE.md`) describe how CMS-driven blocks map to React components.

### Payload Configuration
- Central config: `src/payload.config.ts`
  - Registers all collections, editor (Lexical), MongoDB adapter, S3/R2 storage plugin, i18n (Italian), admin branding components, and TypeScript generation options.
  - The TS output (`src/payload-types.ts`) is consumed by access helpers and frontend utilities for type-safe payload interaction.

### Tests
- Integration tests (`tests/int/api.int.spec.ts`):
  - Boot a Payload instance via `getPayload` + `@/payload.config` and run Vitest tests against its API (e.g. `users` collection).
  - Use these as a pattern for writing further API-level or collection-level tests (permissions, migrations, etc.).
- E2E tests (`tests/e2e/frontend.e2e.spec.ts`):
  - Playwright tests hitting `http://localhost:3000` and asserting the main page behavior.
  - When writing new E2E tests, follow this pattern and ensure the dev server is running before `pnpm test:e2e`.

## Repository Documentation Pointers
Important docs referenced from `README.md` (names may evolve over time):
- Multi-tenant quickstart and troubleshooting: `MULTITENANT_QUICKSTART.md`.
- Detailed SaaS multi-tenant design: `SAAS_MULTITENANT_GUIDE.md`.
- Architecture diagrams and deeper overview: `ARCHITECTURE.md`.
- Feature-specific guides (blocks, pages, menu collection, navbar customization):
  - `BLOCKS_GUIDE.md`
  - `PAGES_GUIDE.md`
  - `MENU_COLLECTION_GUIDE.md`
  - `NAVBAR_CUSTOMIZATION_GUIDE.md`

When you need more detail than this file provides, prefer these docs before diving into implementation files.