import type { HTMLAttributes } from 'react';

/**
 * Passthrough mock for `Card`. Renders a plain `<div>` so that click handlers
 * and child content are accessible in tests.
 */
export function MockCard({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}
