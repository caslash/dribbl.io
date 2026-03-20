# Web App — Testing

Vitest + React Testing Library. All test files live under `test/`, which mirrors the `src/` structure.

## Directory Structure

```
test/
  components/       # Tests for src/components
  hooks/            # Tests for src/hooks
  providers/        # Tests for src/providers
  pages/            # Tests for src/pages
  utils/            # Tests for any src/utils
  mocks/
    components/
      index.ts              # Barrel — re-exports all mock components
      ComponentsMock.ts     # Aggregate object for vi.mock('@/components', ...)
      MockButton.tsx
      MockCard.tsx
      ...
    hooks/
      index.ts              # Barrel — re-exports all mock hooks
      HooksMock.ts          # Aggregate object for vi.mock('@/hooks', ...)
      useMockMyHook.ts
      ...
    providers/
      index.ts              # Barrel — re-exports all mock providers
      ProvidersMock.ts      # Aggregate object for vi.mock('@/providers', ...)
      MockMyProvider.tsx
      ...
```

## Mocks

### Barrel files

Each `test/mocks/<type>/index.ts` re-exports every mock in that directory:

```ts
// test/mocks/components/index.ts
export { MockButton } from './MockButton';
export { MockCard } from './MockCard';
```

### Aggregate objects

Each `test/mocks/<type>/<Type>Mock.ts` imports everything from its barrel and re-exports it as a single named object. This object is shaped to match the corresponding `src/` barrel so it can be spread directly into `vi.mock`.

```ts
// test/mocks/components/ComponentsMock.ts
import * as mocks from './index';

export const ComponentsMock = { ...mocks };
```

```ts
// test/mocks/hooks/HooksMock.ts
import * as mocks from './index';

export const HooksMock = { ...mocks };
```

```ts
// test/mocks/providers/ProvidersMock.ts
import * as mocks from './index';

export const ProvidersMock = { ...mocks };
```

### Using the aggregate object in tests

Mock an entire barrel in one `vi.mock` call by spreading the aggregate object:

```ts
vi.mock('@/components', async () => {
  const { ComponentsMock } = await import('../mocks/components/ComponentsMock');
  return { ...ComponentsMock };
});

vi.mock('@/hooks', async () => {
  const { HooksMock } = await import('../mocks/hooks/HooksMock');
  return { ...HooksMock };
});

vi.mock('@/providers', async () => {
  const { ProvidersMock } = await import('../mocks/providers/ProvidersMock');
  return { ...ProvidersMock };
});
```

## Naming Conventions

| Type             | Prefix       | Example                                        |
| ---------------- | ------------ | ---------------------------------------------- |
| Mock component   | `Mock`       | `MockButton`, `MockPlayerCard`                 |
| Mock hook        | `useMock`    | `useMockGameState`, `useMockSocket`            |
| Mock provider    | `Mock`       | `MockAuthProvider`, `MockGameProvider`         |
| Aggregate object | `<Type>Mock` | `ComponentsMock`, `HooksMock`, `ProvidersMock` |

## Test File Naming

Name test files after the module they test with a `.spec.ts` / `.spec.tsx` suffix:

```
src/components/Button.tsx       →  test/components/Button.spec.tsx
src/hooks/useGameState.ts       →  test/hooks/useGameState.spec.ts
src/pages/HomePage.tsx          →  test/pages/HomePage.spec.tsx
```
