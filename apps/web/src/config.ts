/**
 * Base URL for the backend API and Socket.io connections.
 * Empty in development (Vite proxy handles routing).
 * Set `VITE_BACKEND_URL` in production (e.g. `https://api.dribbl.io`).
 */
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';
