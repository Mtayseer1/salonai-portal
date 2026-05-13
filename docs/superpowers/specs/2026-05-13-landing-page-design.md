# Landing Page Design — SalonAI Portal

**Date:** 2026-05-13  
**Status:** Approved  
**Scope:** Replace the current root `/` login page with a marketing landing page; move login to `/login`.

---

## Overview

The current `app/page.tsx` serves a login form. This spec replaces it with a full marketing landing page targeting salon owners who may visit the portal directly. The login form moves to `app/login/page.tsx`. Authenticated users hitting `/` are still redirected to their dashboard immediately.

---

## Architecture

### File Changes

| File | Action |
|------|--------|
| `app/page.tsx` | Rewrite — becomes the landing page (Server Component) |
| `app/login/page.tsx` | New file — contains the login form (moved from current `app/page.tsx`) |

### Routing

- `/` → Landing page (public, no auth required)
- `/login` → Login form (replaces current `/` login behavior)
- All existing redirects from `/buy-package`, `/dashboard`, etc. that point to `/` on unauthenticated access remain correct — they will land on the marketing page, which has a "Sign In" button in the navbar.

### Component Boundary

The landing page root is a **Server Component** (no `'use client'`). Two small interactive sub-components are defined inline and marked `'use client'`:

- `LandingNav` — handles mobile hamburger toggle and scroll-based navbar background
- `FaqItem` — handles individual accordion open/close state

All other sections are pure JSX with no client state.

---

## Design Tokens

Inherits the existing project design system from `app/components/ui.tsx` and `app/globals.css`:

| Token | Value |
|-------|-------|
| Page background | `radial-gradient(circle at top left, rgba(192,132,252,0.16), transparent 34%), linear-gradient(135deg, #07070a 0%, #101014 48%, #07070a 100%)` |
| Primary accent | `fuchsia-100`, `fuchsia-200`, `fuchsia-300` |
| Card border | `border-white/10` |
| Card background | `bg-white/[0.07] backdrop-blur-xl` |
| Body text | `text-zinc-400` |
| Muted label | `text-zinc-500` |
| Section content width | `max-w-5xl mx-auto px-4` (wider than the app's `max-w-[430px]`) |

---

## Sections

### 1. Sticky Navbar (`LandingNav` client component)

- `position: sticky top-0 z-50`
- Background: transparent by default; on scroll past 10px → `bg-black/40 backdrop-blur-xl border-b border-white/10` (JS `scroll` listener with `useEffect`)
- Left: `<Brand />` (existing component — "SA" monogram + "SALON AI" text)
- Center (md+): anchor links `#features`, `#pricing`, `#faq`
- Right: "Sign In" button → `/login`
- Mobile: hamburger icon toggles a full-width dropdown with the nav links + Sign In

### 2. Hero

Visual center: `favicon.ico` rendered via `<Image src="/favicon.ico" width={80} height={80} alt="SalonAI" unoptimized />` with a fuchsia radial glow ring (`box-shadow: 0 0 60px rgba(240,171,252,0.3)`).

```
[label]  AI-POWERED HAIRSTYLE PREVIEW
[icon]   favicon.ico — 80×80px, centered, fuchsia glow
[h1]     See Your New Look Before You Commit
[sub]    SalonAI lets salons show clients realistic AI previews
         of any hairstyle — instantly, before they sit in the chair.
[CTAs]   [Get Started →]  →  /login
         [How It Works ↓]  →  #features (smooth scroll)
```

Animation: Framer Motion staggered fade-up (`opacity: 0→1`, `y: 20→0`) on mount, 100ms delay between each child element.

### 3. Features (`id="features"`)

Label: `AI-POWERED HAIRSTYLE PREVIEW` (uppercase tracking style)  
Heading: `What SalonAI Does`

Three `<Card>` components in a responsive grid (`grid-cols-1 md:grid-cols-3`):

| Card | Title | Body |
|------|-------|------|
| 1 | AI Style Preview | Upload a client photo and receive a realistic AI-generated preview of any hairstyle in under 30 seconds. |
| 2 | Men & Women Catalog | 100+ styles including catalog looks, bridal, signature styles, and smart AI mode for both men and women. |
| 3 | Credit-Based Access | Simple credit system. Buy what you need, use when you want. Top up anytime via CliQ or cash. |

Each card uses a fuchsia symbol glyph (✦ / ◈ / ◇) as the icon — no external icon library.  
Scroll animation: Framer Motion `whileInView={{ opacity: 1, y: 0 }}` with `viewport={{ once: true }}`, staggered 100ms per card.

### 4. Social Proof

Full-width band with three stat blocks and three testimonial cards.

**Stats row (centered):**

| Stat | Label |
|------|-------|
| 100+ | Hairstyle Options |
| 30s | Average Preview Time |
| 2 | Genders Supported |

**Testimonials:** Three `<Card>` components with placeholder quote text, styled with the existing card pattern. Cards use `border-fuchsia-200/20 bg-fuchsia-200/10` accent variant.

### 5. Pricing (`id="pricing"`)

Label: `SIMPLE CREDIT PACKAGES`  
Heading: `Pay Only For What You Use`

Three static cards (Bronze / Silver / Gold):

| Tier | Tag | Description |
|------|-----|-------------|
| Bronze | Starter | Perfect for new salons or testing the platform |
| Silver | Best Value ⭐ (fuchsia badge) | Our most popular package for growing salons |
| Gold | Studio | For high-volume salons running multiple sessions daily |

No exact prices shown — packages are admin-managed. Copy: *"Exact package prices are set by your account manager. Contact us to get started."*

CTA: `[Contact Us on WhatsApp →]` → `https://wa.me/962795080561`

### 6. FAQ (`id="faq"`)

Five `<FaqItem>` accordion items (client component):

1. **What is SalonAI?** — An AI-powered hairstyle and makeup preview tool for salons. Clients can see realistic previews before committing to any style.
2. **How does the AI preview work?** — Upload a client photo, select a style from our catalog or let the AI choose, and receive a realistic preview in under 30 seconds.
3. **Is my client's photo stored?** — Photos are used for AI generation only and are not permanently stored or shared.
4. **How do I pay for credits?** — Credits are purchased via CliQ transfer or cash. Send the transfer screenshot on WhatsApp and our team confirms your top-up.
5. **Does it work for both men and women?** — Yes. SalonAI supports full catalogs for both men and women, including signature looks, bridal styles, and AI smart mode.

Accordion behavior: click to toggle, Framer Motion `AnimatePresence` + `height: 0 → auto` collapse.

### 7. Footer

```
[Brand logo]   SALON AI — Management Portal
               © 2025 SalonAI. All rights reserved.
[links]        WhatsApp Contact | Sign In
```

---

## Animation Strategy

All animations use Framer Motion. No scroll library needed.

| Section | Animation |
|---------|-----------|
| Hero | Staggered mount: `initial={{ opacity:0, y:20 }}` → `animate={{ opacity:1, y:0 }}`, 100ms stagger |
| Feature cards | `whileInView={{ opacity:1, y:0 }}`, `viewport={{ once:true }}`, 100ms stagger |
| Stat numbers | `whileInView` fade-in |
| Testimonials | `whileInView` fade-up |
| Pricing cards | `whileInView` fade-up with stagger |
| FAQ items | `AnimatePresence` for collapse, no scroll trigger |
| Navbar bg | JS `scroll` event in `useEffect`, not Framer |

---

## Constraints

- No external component libraries (AGENTS.md rule)
- No 21st.dev components
- Reuse `<Brand>`, `<Button>`, `<Card>` from `app/components/ui.tsx`
- No new npm packages
- `favicon.ico` referenced as `/favicon.ico` via Next.js `<Image unoptimized>`
- Pricing amounts are not hardcoded — static tier names only, WhatsApp CTA
- RTL / translation: landing page is English-only (no `useTranslation` needed)
- The session redirect from `app/page.tsx` moves to `app/login/page.tsx` with the login form

---

## Success Criteria

- `/` renders the landing page for unauthenticated visitors
- `/login` renders the login form with session redirect behavior intact
- Authenticated users visiting `/login` are redirected to their dashboard
- All 7 sections render correctly on mobile (375px) and desktop (1280px)
- Framer Motion animations trigger correctly on scroll
- Lighthouse performance score ≥ 90 (no heavy images above the fold except favicon.ico at 80px)
