---
name: framer-motion mock pattern for TurnTimer and similar animated components
description: Stable useAnimation mock reference required; factory pattern causes re-render loop that breaks fake timers
type: feedback
---

When mocking framer-motion for components that use `useAnimation()`, the mock factory must return a **stable object reference** — not a new object on every call.

```ts
// WRONG — new object every call, causes re-render loop
vi.mock('framer-motion', () => ({
  useAnimation: () => ({ set: vi.fn(), start: vi.fn().mockResolvedValue(undefined) }),
}));

// CORRECT — stable reference across renders
const ringControls = { set: vi.fn(), start: vi.fn().mockResolvedValue(undefined) };
vi.mock('framer-motion', () => ({
  useAnimation: () => ringControls,
}));
```

Also strip the `animate` prop from the mocked `motion.circle` to prevent React from logging DOM prop warnings that can suppress state update flushing during fake timer tests:

```ts
circle: ({ animate: _animate, ...props }: any) => <circle {...props} />,
```

**Why:** If `useAnimation()` returns a new object each render, any `useEffect` that depends on the returned controls object has an unstable dependency. The effect fires on every render, calling `start()` (which returns a resolved Promise), creating a microtask loop that starves the event queue. `setInterval` callbacks from fake timers never get observed in the DOM.

**How to apply:** Any time a component under test uses `useAnimation` from framer-motion, follow this pattern in the test file. The `ringControls` object can be shared at module scope — `vi.clearAllMocks()` only clears call history, not mock implementations, so `mockResolvedValue` behavior is preserved.
