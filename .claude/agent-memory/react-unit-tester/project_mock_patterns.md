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
