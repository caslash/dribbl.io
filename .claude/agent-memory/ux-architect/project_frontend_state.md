---
name: Frontend Scaffold State
description: What exists in apps/web at project start — blank Vite+React scaffold, no UI libraries installed yet
type: project
---

# Frontend State as of 2026-03-12

- apps/web is a stock Vite + React scaffold
- index.css and App.css are unmodified Vite defaults — should be fully replaced when implementing the design system
- Only one page exists: HomePage (placeholder h1 only)
- Only one route defined: "/" -> HomePage
- No components built yet
- No Tailwind, no Headless UI, no framer-motion, no react-toastify installed per package.json
- React 19, React Router v7 are installed
- Path alias @/ -> src/ is configured
- Barrel files expected at: src/components/index.ts, src/hooks/index.ts, src/providers/index.ts
