# TimeOffer

Mobile-first application for employee leave requests, approvals, and company leave policies. Built with Next.js 16, React 19, Clerk, Prisma/PostgreSQL, and Tailwind CSS 4.

## Local development

Use Node.js 22.18+ (or Node.js 24 LTS) and the project environment configuration.

```sh
npm install
npm run dev
```

Required environment variables: `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY`. The existing Clerk webhook uses `SIGNING_SECRET`. Do not commit credentials.

Clerk session claims must expose the user's public metadata under `metadata` (onboardingCompleted, role, companyId). Local authentication pages are available at `/sign-in` and `/sign-up`.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## Product behavior

- Employees submit leave, view balances, and filter requests by status, type, and dates.
- Administrators review pending requests, manage balances, and invite employees with single-use codes.
- Workweek and company holidays determine billable leave days. Recurring fixed-date holidays apply each year.
- Leave dates are calendar dates stored at UTC midnight. The current business date uses Europe/Belgrade.
- Every approved leave type deducts days from the existing shared balance. Pending requests do not reserve days; sufficient balance is checked when approving.
- Company policy changes apply to new requests. Existing requests retain their recorded day count.
- Requests must contain at least one working day, end today or later, and cover at most 366 calendar days.
- Approval and balance deduction are atomic; processing the same request twice is prevented.
- No schema migration is required for this redesign.

## Interface

Serbian Latin interface, Inter typography, light/dark themes, and a persistent mobile bottom navigation. Public-page content is capped at 1280px with 20–48px gutters. The landing page preview contains explicitly labeled illustrative data.

Team calendars, notifications, request withdrawal, and installable/offline PWA functionality are separate future features.
