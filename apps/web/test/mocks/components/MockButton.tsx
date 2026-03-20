import type { ButtonHTMLAttributes } from 'react';

/**
 * Passthrough mock for `Button`. Renders a plain `<button>` so that role-based
 * queries and form submission still work in tests.
 */
export function MockButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props}>{children}</button>;
}
