---
name: Web App Test Infrastructure
description: Vitest setup, binary location, naming conventions, and how test/CLAUDE.md conventions interact with co-located test requests
type: project
---

The `apps/web` test infrastructure was bootstrapped in the first testing session.

**Vitest config:** `apps/web/vitest.config.ts` — uses `jsdom` environment, globals, `@/` path alias mirroring `vite.config.ts`, setup file at `test/setup.ts`.

**Setup file:** `apps/web/test/setup.ts` — imports `@testing-library/jest-dom` for DOM matchers.

**Vitest binary:** Hoisted to monorepo root — `/Users/cameronslash/Developer/dribbl.io/node_modules/.bin/vitest`. Run from `apps/web/` with that absolute path or via the `npm test` script added to `apps/web/package.json`.

**npm scripts added to `apps/web/package.json`:**
- `"test": "vitest run"`
- `"test:watch": "vitest"`
- `"test:coverage": "vitest run --coverage"`

**Naming convention:** `test/CLAUDE.md` is the authoritative source. Test files always live under `apps/web/test/`, mirroring `src/` structure. File suffix is `.spec.ts` / `.spec.tsx` — never `.test.ts` / `.test.tsx`. Co-located test files under `src/` are wrong placement and must be deleted.

**Why:** Established by `test/CLAUDE.md` — the official team convention. A prior session incorrectly placed `DraftConfigPanel.test.tsx` co-located under `src/`; that file was deleted and replaced with the correct path.

**How to apply:** Always write to `test/` with `.spec.tsx` suffix. If a co-located `.test.tsx` file exists, delete it as part of the rewrite task.

## jsdom limitations

- `scrollIntoView` is not implemented in jsdom. Add `window.HTMLElement.prototype.scrollIntoView = vi.fn()` in `beforeAll` when testing components that call `ref.scrollIntoView()` (e.g. `DraftTimeline`).
- For root-level `onClick` handlers with fake timers, prefer `container.firstChild.click()` over `userEvent` to avoid timing issues.

## "Confirm Pick" disambiguation

`PickConfirmModal` renders "Confirm Pick" as both a `<p>` label and a `<button>` text. Use `getByRole('button', { name: 'Confirm Pick' })` rather than `getByText('Confirm Pick')` to avoid `Found multiple elements` errors.

## MvpPoolEntry fixture requirement

All `MvpPoolEntry` fixtures must include `ptsPg`, `astPg`, `rebPg` (each `number | null`) since they were added to the type. Omitting them causes TypeScript errors.
