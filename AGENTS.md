<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# SalonAI Portal — Agent Coding Standards

This document governs all AI agents (Claude, Codex, or any future agent) working in this repository. Rules are derived from the actual codebase, not generic templates. Violating these rules will break production.

---

## Project Identity

- **Product:** SalonAI — AI-powered hairstyle and makeup preview tool for salons
- **Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Framer Motion, Supabase
- **Platform:** Windows-first development, Vercel deployment
- **Payments:** Manual only — CliQ transfer + WhatsApp confirmation. No Fatora, no Stripe, no online gateway.
- **Languages:** English and Arabic (RTL supported via custom translation system)

---

## Architecture Rules

### Next.js App Router (not Pages Router)

- All pages live under `app/`. Never create files under `pages/`.
- Server components are the default. Add `'use client'` only when you need browser APIs, hooks, or event handlers.
- API routes live under `app/api/[route]/route.ts`. Export named functions `GET`, `POST`, etc.
- Layout files (`layout.tsx`) wrap shared UI. The root layout is `app/layout.tsx`.
- The style flow pages live under `app/style/` and share a layout at `app/style/layout.tsx`.

### Client vs Server boundary

- `src/lib/supabase.ts` — client-side Supabase (anon key). Use only in `'use client'` components and pages.
- `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` — service role client. Use only inside `app/api/` route handlers. **Never expose the service role key to the client.**
- `src/lib/admin-api.ts` — the `adminFetch<T>()` helper for admin page client code calling admin API routes.

### Role hierarchy

Three user roles, each with dedicated DB tables and portal sections:

| Role | Table | Portal path |
|------|-------|-------------|
| Admin | `admins` | `/admin` |
| Partner | `partners` | `/partner` |
| Barber (Salon) | `barbers` | `/dashboard` |

Auth gating: every page that requires auth calls `supabase.auth.getSession()` on mount and redirects to `/` if no session exists. Do not invent new auth patterns.

### Supabase Edge Functions (AI generation)

Generation does NOT happen in Next.js API routes. It is delegated to Supabase Edge Functions:

- `gemini-auto-style` — men's generation (Gemini)
- `gemini-women-style` — women's catalog/signature/bridal/smart generation
- `openai-auto-style` — men's generation (OpenAI, alternate provider)

The `/api/generate` route handles auth, credit reservation, and payload formatting, then calls the appropriate edge function. **Do not add generation logic to Next.js — extend the edge functions instead.**

---

## Coding Standards

### TypeScript

- Strict typing. Never use `any` unless it already exists in the file and you're interfacing with that exact pattern.
- Use `type` not `interface` for object shapes (existing convention).
- Prefer explicit return types on functions used across files.
- Use `ReturnType<>`, `Awaited<>`, and `Parameters<>` generics to derive types rather than duplicating them.

### React patterns

- `useCallback` on all event handlers and functions passed to child components.
- `useMemo` on context values (see `StyleSessionProvider`).
- State initialization with function form when reading from localStorage: `useState(() => load())`.
- No prop drilling beyond two levels — use context.
- Never call `router.push` inside a `useEffect` without a guard — always check the condition first.

### File and export conventions

- Pages: `default export function PageName()`
- Components: named exports
- Utilities: named exports from `lib/`
- UI primitives: all in `app/components/ui.tsx` — add new primitives there, do not create separate component files for one-off UI

### Imports

- Use `@/` alias for `src/` and project root imports (configured in tsconfig).
- Import Supabase client from `../../src/lib/supabase` or `@/lib/supabase` depending on depth.
- Import UI primitives from `@/app/components/ui` or `../components/ui`.

---

## UI / UX Rules

**These rules preserve visual consistency. Breaking them will make new UI look wrong.**

### Color palette (do not deviate)

| Use | Value |
|-----|-------|
| Page background | `radial-gradient(...)` dark base `#07070a` / `#121016` |
| Primary accent | `fuchsia-100`, `fuchsia-200`, `fuchsia-300` |
| Secondary accent | `sky-200`, `sky-300` |
| Card border | `border-white/10` |
| Featured border | `border-fuchsia-200/20` or `border-fuchsia-300/40` |
| Body text | `text-zinc-400` |
| Muted label | `text-zinc-500` |
| Header text | `text-white` |

### Card and surface patterns

```tsx
// Standard card
<div className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-5">

// Elevated card (used on dashboard)
<div className="rounded-[1.6rem] border border-white/10 bg-white/[0.07] shadow-2xl shadow-black/30 backdrop-blur-xl">

// Featured/accent card section
<div className="rounded-3xl border border-fuchsia-200/20 bg-fuchsia-200/10 p-4">
```

### Component usage

- Always use `<Button>`, `<Card>`, `<Alert>`, `<AppShell>`, `<LoadingScreen>`, `<EmptyState>`, `<StatCard>` from `app/components/ui.tsx`.
- Never install an external component library (shadcn, MUI, Chakra, etc.).
- Animations use Framer Motion `<motion.div>` with the `pageMotion` preset from `app/components/ui.tsx`.
- Loading states use `<LoadingScreen label="..." />` — never a raw spinner.

### Typography

- Section labels: `text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500`
- Page headings: `text-2xl font-semibold tracking-tight text-white`
- Body: `text-sm text-zinc-400 leading-6`
- Mono/data values: `font-mono` or `font-semibold tracking-tight`

### Layout

- Max width on mobile-first pages: `max-w-[430px]` centered
- Admin/partner pages use `AppShell` with sidebar nav — never build raw layouts for these roles
- Padding: `px-4 py-5` or `px-4 py-6` at the page level

### RTL / Translation

- The translation system uses a DOM MutationObserver (`components/translation/`). It applies Arabic strings from `lib/translation/dictionary.ts`.
- Wrap dynamic numbers, names, and untranslatable values with `data-translate="no"`.
- Never hardcode display text in Arabic — add it to the dictionary instead.
- The `useTranslation()` hook provides `t(key)`, `language`, and `setLanguage`.

---

## State Management Rules

### Style session (the core flow state)

The entire AI styling flow uses `StyleSessionProvider` and `useStyleSession()`.

- State is persisted to localStorage with debounced writes (300ms).
- `imageFile` (the raw `File` object) is NOT persisted — only `imagePreviewUrl` survives page refreshes.
- When checking image presence for smart mode, always check `imageFile` specifically (not just `imagePreviewUrl`) because generation requires the raw file for base64 encoding.
- Blob URLs are revoked on `setImage()` and on unmount. Never manually call `URL.revokeObjectURL` outside of this provider.
- `resetSession()` clears everything including localStorage. Call it only at the explicit end of a session.

### Do not add new global state stores

No Redux, no Zustand, no Jotai. If shared state is needed, extend the existing context or add a new narrow context.

---

## API / Database Safety Rules

### Supabase queries

- Use `.maybeSingle()` when the record may not exist. Use `.single()` only when absence is an error (will throw on missing row).
- Always destructure `{ data, error }` and check `error` before using `data`.
- Never chain `.data.property` without a null check — `data` can be null on error.
- Use `.in('column', arrayOfIds)` for bulk lookups rather than N individual queries.
- Parallelize independent queries with `Promise.all([query1, query2])`.

### Credit system (critical — do not touch without understanding fully)

The credit reservation in `/api/generate` uses optimistic locking:

```typescript
.update({ remaining_credits: nextCredits })
.eq('id', userId)
.eq('remaining_credits', currentCredits)   // ← optimistic lock
.gte('remaining_credits', CREDIT_COST)
```

This prevents double-spending. **Never bypass this check. Never decrement credits directly without using `reserveGenerationCredit()`.**

On any generation failure after reservation, `refundGenerationCredit()` must be called with `await`. This is non-negotiable.

`CREDIT_COST = 1` is a module-level constant. Do not change it without explicit business instruction.

### Admin routes

- All admin API routes must call `requireAdmin(request)` from `app/api/admin/_lib.ts` as the first operation.
- The bootstrap logic (first user becomes admin) is intentional. Do not remove it.
- Admin DB operations use the service role client — never the anon client.

### Payments

- Payments are manual. There is no online payment gateway active.
- `/api/create-payment` and `/app/payment-success/` are legacy dead code. Do not restore them.
- Credit top-ups are done by admins via the admin portal manually.
- The buy-package page (`/buy-package`) is informational — it shows packages and a WhatsApp link. No transaction processing happens there.

### Edge function payload field names

The payload sent to Supabase edge functions has specific field names the edge function expects. **Never rename fields in `createGenerationPayload()` without coordinating the edge function change simultaneously.**

Key fields: `src_file_url`, `src_file_base64`, `src_file_mime_type`, `gender`, `mode`, `isSmartStyle`, `log_context`.

---

## Safety Rules

### Never do these

- Never delete `app/api/generate/route.ts` or any of its helper functions.
- Never delete `components/style-session/` — this is the entire flow's state layer.
- Never modify `supabase/migrations/` without a corresponding DB migration run.
- Never commit `.env.local` or any file containing API keys.
- Never call `supabase.auth.admin.*` from client-side code.
- Never add `console.log` with user data or session tokens.
- Never use `dangerouslySetInnerHTML` — the translation system does not need it.
- Never install packages that add >50KB to the client bundle without explicit approval.

### Git safety

- Work on feature branches for tasks, not directly on `main`.
- Commit messages: `type(scope): description` format. Examples: `fix(generate): await refund on edge failure`, `feat(dashboard): add session history page`.
- Never force-push to `main`.
- Never amend published commits.

### File safety

- Do not delete any existing page without verifying it is genuinely unreachable (no nav link, no redirect, no direct URL users may have bookmarked).
- Do not rename or move API routes — this breaks external callers (payment gateway callbacks, mobile clients).
- The `public/` directory contains style reference images used by the catalog and edge functions. Never delete images from `public/`.

---

## Generation Flow Reference

Understanding this is required before touching any style-related code.

```
/style/info        → gender + mode selection
/style/photo       → image upload (File → blob URL stored in session)
/style/[gender]/options  → smart/catalog/bridal/signature mode picker
/style/women/catalog/[category]  → per-category option selection
/style/women/catalog/review      → review all selections
/style/loading     → triggers POST /api/generate, polls for result
/style/result      → shows generated image, download/share
```

Men flow: info → photo → options → (catalog → catalog/review | smart → loading) → result
Women flow: info → photo → options → (catalog → 12 category pages → review | smart → loading | bridal → bridal/review | signature → signature) → loading → result

---

## Naming Conventions

| Thing | Convention | Example |
|-------|------------|---------|
| Page files | `page.tsx` in route directory | `app/style/photo/page.tsx` |
| Component | PascalCase named export | `export function StyleCard()` |
| Hook | `use` prefix | `useStyleSession()` |
| API route handler | Named HTTP verb export | `export async function POST()` |
| Utility function | camelCase | `createGenerationPayload()` |
| Types | PascalCase, inline or in `*-types.ts` | `StyleFlowSessionState` |
| Constants | SCREAMING_SNAKE | `CREDIT_COST`, `NO_STORE_HEADERS` |
| Supabase table | snake_case | `barbers`, `style_sessions`, `credit_transactions` |

---

## Performance Rules

- Never fetch sequentially when requests are independent — use `Promise.all`.
- Catalog images: use `loading="lazy"` unless above-the-fold.
- Never call `supabase.auth.getSession()` in a render — only in `useEffect` or server context.
- The translation MutationObserver already watches `document.body`. Do not add another observer.
- State changes that trigger localStorage saves are debounced at 300ms. Do not reduce this.

---

## Extensibility Notes

When adding a new AI generation mode:

1. Add the mode name to the `StyleSessionMode` union type in `lib/style-session/style-session-types.ts`
2. Add validation in `/api/generate/route.ts` (`if (body.mode !== ...)`)
3. Add the route case in `createGenerationPayload()`
4. Add routing logic in `app/style/photo/page.tsx` `continueToOptions()`
5. Create the new option/review pages under `app/style/[gender]/[mode]/`
6. Add the new edge function on the Supabase side

When adding a new admin feature:

1. Add the route under `app/api/admin/[feature]/route.ts`
2. Call `requireAdmin(request)` as the first line
3. Add nav item to `adminNav` in `app/components/ui.tsx`
4. Create the page under `app/admin/[feature]/page.tsx`
