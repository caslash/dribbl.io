---
name: clipboard spy must follow userEvent.setup()
description: userEvent.setup() replaces window.navigator.clipboard with its own mock — spy on writeText AFTER calling setup(), not in beforeEach
type: feedback
---

`@testing-library/user-event` v14's `userEvent.setup()` installs its own clipboard mock on `window.navigator`, replacing whatever was there before. Any `vi.spyOn(window.navigator.clipboard, 'writeText')` installed in `beforeEach` will be overwritten when the test body calls `userEvent.setup()`.

**Why:** Discovered during debugging of DailyResultPanel clipboard tests. `beforeEach` spy showed `spy === window.navigator.clipboard.writeText` as `true`, but immediately after `const user = userEvent.setup()` in the test body, it became `false`. userEvent replaces the clipboard property.

**How to apply:** In any test that needs to spy on `navigator.clipboard.writeText` AND uses `userEvent`, always call `userEvent.setup()` FIRST and then install the spy:

```tsx
it('copies text to clipboard', async () => {
  const user = userEvent.setup();  // installs its clipboard mock
  const writeTextSpy = vi.spyOn(window.navigator.clipboard, 'writeText').mockResolvedValue(undefined);

  render(<MyComponent />);
  await user.click(screen.getByRole('button'));

  expect(writeTextSpy).toHaveBeenCalledWith('expected text');
});
```

Use `vi.restoreAllMocks()` in `afterEach` to clean up. Do NOT put the spy in `beforeEach` before `userEvent.setup()` — it will be silently overwritten.
