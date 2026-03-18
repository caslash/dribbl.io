---
name: Web App Mock Patterns
description: How to mock hooks, components, and context in dribbl.io web app tests — established patterns from DraftConfigPanel tests
type: project
---

## Mock infrastructure location

All mocks live under `apps/web/test/mocks/`, organized by type. Established mocks:

- `test/mocks/components/` — `MockButton.tsx`, `MockCard.tsx`, `MockInput.tsx`, `index.ts`, `ComponentsMock.ts`
- `test/mocks/hooks/` — `useMockDraft.ts`, `index.ts`, `HooksMock.ts`

## Aggregate mock pattern

Each mock directory has a `<Type>Mock.ts` that exports a single named object matching the shape of the corresponding `src/` barrel. Spread it into `vi.mock`:

```ts
vi.mock('@/components', async () => {
  const { ComponentsMock } = await import('../../mocks/components/ComponentsMock');
  return { ...ComponentsMock };
});
```

## Mocking hooks — direct import path vs barrel

Check the import path in the component under test. `DraftConfigPanel` imports from `@/hooks/useDraft` (direct, not barrel). Mock the exact path the component uses:

```ts
vi.mock('@/hooks/useDraft', async () => {
  const { useMockDraft } = await import('../../mocks/hooks/useMockDraft');
  return { useDraft: useMockDraft };
});
```

When testing a component that imports from the `@/hooks` barrel, use `HooksMock` instead.

## Mocking components from `@/components`

`Button`, `Card`, and `Input` are thin HTML wrappers. Their mocks (`MockButton`, `MockCard`, `MockInput`) are passthrough components that render the equivalent native HTML element with all props forwarded. This keeps role-based queries, label associations, and form interactions working without using the real Tailwind-heavy implementations.

## Named mock stubs (useMockDraft)

`useMockDraft.ts` exports named `vi.fn()` stubs (`mockSaveConfig`, `mockCreateRoom`, etc.) in addition to the hook function. In test files, import these named stubs for assertions:

```ts
const { mockSaveConfig } = await import('../../mocks/hooks/useMockDraft');
expect(mockSaveConfig).toHaveBeenCalledWith(...);
```

`vi.clearAllMocks()` in `afterEach` resets all stubs between tests.

## Context providers

`DraftProvider` manages a real Socket.io connection. Never render it in unit tests. Mock `useDraft` at the module level via `@/hooks/useDraft`.

## `ModeCard` and `OrderToggle` sub-components

File-private sub-components in `DraftConfigPanel.tsx`. `ModeCard` renders as `div` (via `MockCard`), `OrderToggle` as `button`. Query `ModeCard` by its title text then `.closest('[class*="border-burgundy"]')` to assert active state. Query `OrderToggle` via `getByRole('button', { name: 'Snake' })` and check `.className` with `.toMatch(/bg-burgundy/)`.

NOTE: the existing `DraftConfigPanel.spec.tsx` tests for active state use `bg-burgundy`/`border-burgundy` class names but the source actually uses `red-600`. Those 6 tests were failing before new work was added and are a pre-existing bug in the test file, not in the source.

## Per-test mock state (module-closure pattern)

When a component consumes a hook whose return value needs to vary per test, use a module-level mutable variable that the `vi.mock` factory captures via closure:

```ts
let mockState = { /* default */ };

vi.mock('@/hooks/useDraft', () => ({
  useDraft: () => ({ state: mockState, ... }),
}));

// In each test:
mockState = { ...customState };
render(<Component />);
```

Reset in `afterEach`. This avoids the `vi.mocked().mockReturnValue is not a function` error that occurs when the mock export is a plain function (not `vi.fn()`).

## socket.io-client mock

When testing DraftProvider, mock `socket.io-client` by capturing a call-count-based factory:

```ts
let ioCallCount = 0;
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => { ioCallCount++; return ioCallCount === 1 ? socketA : socketB; }),
}));
```

Reset `ioCallCount` and socket instances in `beforeEach`. First call = temp socket (createRoom), subsequent calls = real socket.

## TurnTimer testability caveat

`TurnTimer` uses `Date.now()` inside `setInterval`. In jsdom + Vitest fake timers, `vi.advanceTimersByTime()` correctly advances `Date.now()`, but React state updates triggered by the interval callback (`setSecondsLeft`) do not flush to the DOM even inside `act()`. The countdown display and warning CSS class cannot be tested at the DOM level under the current implementation. Use `it.skip` with a `// BUG:` comment for these cases. The `onExpire` callback CAN be tested since it uses a ref guard.

## SVG className quirk

In jsdom, SVG elements have `className` as `SVGAnimatedString`, not a plain string. Use `svg?.getAttribute('class')` instead of `svg?.className` for string operations.

## framer-motion mock

Components that import from `framer-motion` (`motion.*`, `AnimatePresence`, `useReducedMotion`) must have `framer-motion` mocked or they fail in jsdom. Use a minimal inline mock at the top of the test file:

```ts
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <header {...props}>{children}</header>
    ),
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));
```

Add more `motion.*` keys as needed for each HTML element the component uses.

## Duplicate-text pitfalls in DraftResults

`DraftResults` renders a sidebar pick-count panel alongside the main table. Both render participant names and "(You)" labels. `getByText` will throw on these. Always use `getAllByText(...)` with a `length >= 1` assertion, or scope the query to the `table` element when asserting on table-specific content.

## useNavigate mock for react-router

`DraftResults` imports from `react-router` (not `react-router-dom`). Mock accordingly:

```ts
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));
```

## Static import vs dynamic import for components

When a test's mock captures state via a module-level closure variable (the preferred pattern), import the component under test with a static top-level `import`. Only use `await import(...)` inside `setup()` when the module itself needs to be re-evaluated per test (e.g., when `vi.resetModules()` is called). Mixing `require()` with Vitest ESM mocks will fail with `MODULE_NOT_FOUND`.
