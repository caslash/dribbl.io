---
name: Frontend Scaffold State
description: Actual state of apps/web as of 2026-03-17 — fully built draft and career path UIs, Tailwind v4 with custom tokens, real component library in place
type: project
---

# Frontend State as of 2026-03-17

The app is well past scaffold — both game modes have functional UIs.

## Libraries in use
- Tailwind CSS v4 (CSS-first, @theme block in index.css, no tailwind.config.js)
- React Router v7
- socket.io-client
- react-toastify (toast notifications already wired in DraftProvider)
- framer-motion (referenced in design spec, confirmed intended)

## Design token system
All tokens live in `apps/web/src/index.css` under `@theme {}`. Dark mode via `html.dark`. Key semantic token groups:
- Surfaces: `bg-surface`, `bg-surface-raised`, `bg-surface-warm`, `bg-surface-border`
- Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`, `text-text-placeholder`
- Border: `border-primary-border`, `border-border`, `border-border-subtle`
- Primary (Court Blue): `bg-primary`, `text-primary`, `text-primary-text`
- Accent (Arena Red): `bg-accent`, `text-accent`, `border-accent-border`
- Highlight (Ball Orange): `bg-highlight`, `text-highlight`
- Note: `bg-secondary` and `bg-card` used in DraftResults.tsx are NOT defined in @theme — these are Tailwind defaults or undefined. Should use `bg-surface-raised` and `bg-surface-warm` from the token system instead.

## Component inventory (draft game)
- `DraftResults.tsx` — basic scaffold only, needs full redesign
- `ParticipantTeam.tsx` — grid of picked players per participant, no headshots yet
- `DraftPickCard.tsx` — compact card: headshot + player + participant + round/pick label (w-28 fixed)
- `PoolEntryCard.tsx` — grid card: headshot with mask-b fade, player name, subtitle, hover states
- `PoolEntryRow.tsx` — row variant: small headshot, name, subtitle, stat pills (PTS/AST/REB for MVP mode)
- `DraftTimeline.tsx` — horizontal scrollable strip of all draft slots (past/active/upcoming)
- `RoomSidebar.tsx` — left sidebar: room code + participant list (w-56)
- `ParticipantList.tsx` — participant roster
- `OnTheClockCard.tsx` — active turn card with timer
- `UpcomingPickCard.tsx` — future slot placeholder card
- `PickAnnouncementModal.tsx` — pick confirmation modal
- `PickConfirmModal.tsx` — pre-pick confirmation
- `DraftConfigPanel.tsx` — organizer config UI
- `PoolPreview.tsx` — pool grid before draft starts
- `DraftBoard.tsx` — main drafting screen layout
- `TurnTimer.tsx` — timer display component

## Page/layout architecture
- `DraftRoomPage.tsx` renders: persistent `RoomSidebar` (left, w-56) + `<main>` (flex-1)
- Results phase: `<div class="flex flex-col gap-6 p-4 max-w-5xl mx-auto w-full">` wrapping `<DraftResults />`
- The RoomSidebar stays visible during results — this is intentional

## Known token issues in existing code
- DraftResults.tsx uses `bg-secondary` (undefined) — should be `bg-surface-raised`
- ParticipantTeam.tsx uses `bg-card` (undefined) — should be `bg-surface-raised`
- Both components are candidates for redesign in the results screen spec
