import type { InputHTMLAttributes } from 'react';

/**
 * Passthrough mock for `Input`. Renders a plain `<input>` so that label
 * associations, value queries, and user-event interactions work in tests.
 */
export function MockInput({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}
