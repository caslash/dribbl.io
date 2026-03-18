---
name: Design System Foundation
description: Core design tokens, typography, spacing, and component visual specs established for dribbl.io in the v1.0 design spec session
type: project
---

# dribbl.io Design System — Established Decisions (v1.0)

## Status
Full design spec delivered 2026-03-12. Frontend is a blank Vite + React scaffold — spec is the foundation to implement from scratch.

## Libraries to install (not yet installed as of 2026-03-12)
- tailwindcss + @tailwindcss/vite (v4, CSS-first, no tailwind.config.js)
- @headlessui/react
- framer-motion
- lucide-react
- socket.io-client

## Color Palette — Semantic Token Names

Light mode base: cream/ivory (#F7F2EA page bg)
Dark mode base: near-black navy (#0F1923 page bg)

### Light mode tokens
- --color-surface-0: #F7F2EA (page bg)
- --color-surface-1: #FFFFFF (card)
- --color-surface-2: #FDFAF5 (elevated: dropdown, modal)
- --color-text-primary: #111827
- --color-text-secondary: #4B5563
- --color-text-muted: #9CA3AF (decorative only — does not meet AA for meaningful text)
- --color-border: #E5DDD0
- --color-border-focus: #1D3557
- --color-accent-navy: #1D3557 (primary action)
- --color-accent-navy-hover: #162844
- --color-accent-wine: #7C2D3B (secondary/destructive accent)
- --color-accent-wine-hover: #641F2D
- --color-accent-gold: #C9973A (trophy/correct moments)
- --color-success: #15803D / --color-success-surface: #DCFCE7
- --color-error: #B91C1C / --color-error-surface: #FEE2E2
- --color-warning: #B45309 / --color-warning-surface: #FEF3C7

### Dark mode overrides (via .dark class on <html>)
- --color-surface-0: #0F1923
- --color-surface-1: #1A2636
- --color-surface-2: #223044
- --color-text-primary: #F1EDE6
- --color-text-secondary: #9DB4C8
- --color-text-muted: #5A7A95
- --color-border: #2C3E52
- --color-border-focus: #7CA9C9
- --color-accent-navy: #4A90C4
- --color-accent-navy-hover: #5BA3D8
- --color-accent-wine: #C45A6A
- --color-accent-wine-hover: #D46878
- --color-accent-gold: #D4A84B
- --color-success: #22C55E / --color-success-surface: #14532D
- --color-error: #F87171 / --color-error-surface: #450A0A
- --color-warning: #FBBF24 / --color-warning-surface: #451A03

## Typography

- Headings: Georgia (system serif, no import needed), weight 700
- Body/UI: Inter (Google Fonts, weights 400/500/600)

### Scale
- Display heading / score: 48px / 1.1 / Georgia 700 / tracking -0.02em
- Section heading (h1): 32px / 1.2 / Georgia 700 / -0.01em
- Subsection (h2): 24px / 1.25 / Georgia 600 / -0.01em
- Card heading (h3): 20px / 1.3 / Georgia 600
- Label heading (h4): 16px / 1.4 / Inter 600
- Body: 15px / 1.6 / Inter 400 (base font-size set on html)
- Body emphasis: 15px / 1.6 / Inter 500
- Small/caption: 12px / 1.5 / Inter 400 / tracking 0.01em
- Badge/chip label: 11px / 1 / Inter 600 / tracking 0.04em / uppercase
- Round timer: 32px / 1 / Georgia 700 / -0.01em

## Tailwind v4 Config
- CSS-first via @theme {} block in src/index.css
- App.css deleted — all styles in index.css
- Dark mode: .dark class on <html>, toggled by ThemeProvider, persisted in localStorage
- Tailwind v4 Vite plugin: @tailwindcss/vite (not PostCSS)
- Token changes in .dark {} block auto-update all utilities — dark: variants only for layout/structural dark-mode differences

## Spacing & Layout
- Max content width: 1120px
- Nav height: 56px
- Page horizontal padding: 16px mobile / 24px tablet / 40px desktop
- Card padding: 24px standard / 16px compact
- Section gap: 32–48px
- Border radius: 9999px pill buttons/tags, 8px cards/inputs, 6px badges/chips

## Component Specs Summary

### Button — Primary
- Background: --color-accent-navy, text white, pill (rounded-full)
- Height 44px, Inter 600 15px
- Hover: --color-accent-navy-hover
- Active: scale(0.97)
- Disabled: opacity 0.45

### Button — Secondary/Ghost
- Transparent bg, 1.5px solid --color-border, pill
- Hover: border --color-text-secondary + bg --color-surface-2

### Card
- bg-surface-1, 1px border --color-border, rounded-lg (8px), p-6
- Shadow: 0 1px 3px rgba(0,0,0,0.06) — suppress shadow in dark mode

### Badge (team abbreviation)
- Height 32px, 6px radius, Inter 600 11px uppercase tracking-wide
- Neutral: bg-surface-2, border-border
- Colored: team primary color at 12% opacity bg, full opacity text
- Aria-label: full team name always

### Input
- bg-surface-1, 1px border-border, rounded-lg, height 48px
- Focus: 1.5px border-focus + box-shadow glow
- Error: 1.5px border-error + glow

### TeamHistoryDisplay
- Horizontal scrollable row, no wrap
- Badges: height 40px, min-width 52px, 13px Inter 600
- Connectors: 24px chevron SVG, aria-hidden
- Fade mask on right edge when overflowing
- Stagger entrance animation on round start

### PoolEntryCard
- bg-surface-1, border-border, rounded-lg, p-4
- Available hover: 1.5px border-accent-navy + bg-surface-0
- Unavailable: opacity 0.40, line-through name, cursor not-allowed, aria-disabled

## Game UX Conventions
- Draft pool grid: 3 cols desktop / 2 cols tablet / 1 col mobile
- Available pool entries listed first, unavailable at bottom
- Pool search filter above grid, local JS filter (no network)
- Active turn: pulsing navy border ring (2s ease-in-out, prefers-reduced-motion disables pulse)
- Turn banner: "Your pick — select a player" in accent-navy bar above grid
- Lives: heart icons (--color-error filled, outlined for lost). Max 5 hearts; show "♥ × n" if lives > 5
- Score: Georgia 700 48px in accent-navy, with Inter 600 12px uppercase "Score" label above
- Streak display for infinite mode

## Animation (framer-motion)
- Correct guess overlay: scale 0.92→1, opacity 0→1, 200ms ease-out-expo, auto-dismiss 1800ms
- Wrong guess: input shake keyframes x: [0,-8,8,-6,6,-3,3,0], 400ms
- Pick confirmed: card scale 1→1.04→1 + opacity →0.40, 280ms total
- Timer low (<5s): pulse scale [1,1.12,1], 800ms, repeat. Color → warning. At 3s → error
- Route transitions: opacity 0→1, 180ms. AnimatePresence mode="wait"
- All animations gated behind useReducedMotion() check

## Accessibility Non-Negotiables
- aria-live="polite" region on all game screens for state announcements
- Focus to input on round start, focus into overlay on mount, restore on close
- Arrow-key navigation in draft grid (role="grid" or roving tabindex)
- Team badge aria-label = full team name (not abbreviation)
- min 44×44px touch targets everywhere
- Color never sole conveyor of meaning — icon + text + color
- --color-text-muted fails AA — only use for placeholders and decorative text
- Verify warning color (#B45309) only used at 14px+ body text sizes
