# React/Vite Engineer Memory

## Project: dribbl.io — `apps/web`

### Key Architecture

- **Tailwind v4**: CSS-first config via `@theme {}` in `src/index.css`. No `tailwind.config.js`. Uses `@tailwindcss/vite` plugin.
- **Path alias**: `@/` resolves to `src/`. Configured in both `vite.config.ts` and `tsconfig.app.json` (`baseUrl: "."`, `paths: { "@/*": ["./src/*"] }`).
- **Router**: `react-router` v7 (not `react-router-dom`). Import from `'react-router'`.
- **Socket.io namespace**: Career Path gateway uses `/careerpath` namespace, NOT root `/`. Connect: `io('/careerpath', { query: { roomId } })`.
- **API port**: Backend runs on 3001. Dev server (3000) proxies `/api` → `http://localhost:3001`.
- **`@dribblio/types`**: Has TypeORM decorators and no dist build — DO NOT import in `apps/web`. Define local lightweight interfaces mirroring the shapes instead.

### Barrel File Conventions

- `src/components/index.ts` — export all components
- `src/hooks/index.ts` — export all hooks
- `src/providers/index.ts` — export all providers (and their types)
- Pages are NOT barrel-exported; import directly in `App.tsx`

### Career Path Game Flow

1. `POST /api/careerpath/room` on provider mount → `{ roomId: string }`
2. Socket connects lazily when `saveConfig()` is called
3. Emit `SAVE_CONFIG` → server responds `NOTIFY_CONFIG_SAVED` → automatically emit `START_GAME`
4. Server sends `NOTIFY_NEXT_ROUND` → game begins
5. Each guess triggers `NOTIFY_CORRECT_GUESS` or `NOTIFY_INCORRECT_GUESS`, then `NOTIFY_NEXT_ROUND`
6. `NOTIFY_NEXT_ROUND` resets `lastResult` to null — the feedback panel clears automatically

### Component Structure

- Career Path components live in `src/components/career/`
- Shared UI: `Button`, `Card`, `Badge`, `Input`, `PlayerSearchInput` in `src/components/`
- `AppLayout` handles nav shell + dark mode toggle (stored in `localStorage` as `theme: 'dark' | 'light'`, applied as `class="dark"` on `<html>`)
- Dark mode: `html.dark` class toggles Tailwind dark variants

### Design Tokens (from `index.css`)

- Primary palette: `navy-{700-950}`, `cream-{50-300}`, `burgundy-{500-700}`
- Semantic: `success`, `error`, `warning` with `-light` variants
- Font: `--font-serif` for headings, `--font-sans` for body

### Package Notes

- `@headlessui/react` v2: `ComboboxOption` uses `data-focus` attribute (not `data-headlessui-state="active"`)
- `framer-motion` v12: AnimatePresence + motion.div for transitions
- `react-toastify` v11: `<ToastContainer>` in App.tsx, `toast.error()` for errors
