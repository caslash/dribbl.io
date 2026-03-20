/**
 * Base URL for the backend API and Socket.io connections.
 * Empty in development (Vite proxy handles routing).
 * Set `VITE_BACKEND_URL` in production (e.g. `https://api.dribbl.io`).
 */
if (import.meta.env.PROD && !import.meta.env.VITE_BACKEND_URL) {
  throw new Error('VITE_BACKEND_URL must be set in production builds');
}

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';
