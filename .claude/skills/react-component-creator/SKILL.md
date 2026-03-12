---
name: react-component-creator
description: >
  Creates new React components and pages in apps/web following project conventions.
  Use this skill whenever the user asks to create, add, or build a new React component,
  UI element, page, or screen in the web app — even if they don't say "component" explicitly.
  Trigger for requests like "add a PlayerCard", "build a leaderboard page", "make a loading spinner",
  "I need a modal for the draft room", or "create a GameHeader". Covers both reusable components
  (src/components/) and route-level pages (src/pages/). Always invoke this skill before starting
  any component or page creation work.
---

# React Component Creator

You are creating a component or page in the `apps/web` Vite + React frontend. Follow these conventions exactly.

## Step 1: Decide where it goes

**Reusable component** → `src/components/YourComponent.tsx`
- Used in more than one place, or clearly reusable UI (buttons, cards, modals, headers)

**Page component** → `src/pages/YourNamePage.tsx`
- Maps to exactly one route; name must end in `Page`

When in doubt, prefer a component. Pages are route-level shells, not just any large UI piece.

## Step 2: Write the component file

Follow this structure:

```tsx
// src/components/PlayerCard.tsx

interface PlayerCardProps {
  name: string;
  team: string;
  pointsPerGame: number;
}

/**
 * Displays a player's name, team, and points per game.
 *
 * @param props.name - The player's full name.
 * @param props.team - The player's current team abbreviation.
 * @param props.pointsPerGame - The player's points per game average.
 *
 * @example
 * <PlayerCard name="LeBron James" team="LAL" pointsPerGame={25.7} />
 */
export const PlayerCard = ({ name, team, pointsPerGame }: PlayerCardProps) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{team} · {pointsPerGame} PPG</p>
    </div>
  );
};
```

Rules:
- **Named exports only** — no `export default`
- Props interface defined in the same file, directly above the component
- JSDoc on the component with `@param` for each prop and an `@example` tag
- No comments that restate what the code does

## Step 3: Update the barrel file (components only)

If you created a component (not a page), add it to `src/components/index.ts`:

```ts
export { PlayerCard } from './PlayerCard';
```

Pages are **not** added to a barrel. They're imported directly in `src/App.tsx`.

## Step 4: Add a route (pages only)

If you created a page, add it to `src/App.tsx`:

```tsx
import { YourNamePage } from './pages/YourNamePage';
// ...
<Route path="/your-path" element={<YourNamePage />} />
```

## Step 5: Create a mock for the test suite (components only)

For reusable components, create a lightweight mock so tests that import `@/components` can stub it out:

**`test/mocks/components/MockYourComponent.tsx`**
```tsx
export const MockYourComponent = () => <div data-testid="mock-your-component" />;
```

Then add the export to `test/mocks/components/index.ts`:
```ts
export { MockYourComponent } from './MockYourComponent';
```

`ComponentsMock` spreads the index barrel automatically — no other changes needed.

## Step 6: Hand off to the react-unit-tester agent

Once all files are written, you **must** invoke the `react-unit-tester` agent — don't skip this step or leave it as a suggestion. Use the Agent tool directly:

```
subagent_type: react-unit-tester
prompt: "Write tests for the new [ComponentName] component.
  - Component: apps/web/src/components/[ComponentName].tsx (or src/pages/...)
  - Mock: apps/web/test/mocks/components/Mock[ComponentName].tsx (if created)
  - What it does: [one-sentence description]"
```

The agent handles the test file placement (`test/components/` or `test/pages/`), imports, and Vitest + React Testing Library conventions.
