import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Additional class names to merge onto the card. */
  className?: string;
}

/**
 * Simple container card with consistent background, border, shadow, and padding.
 *
 * @example
 * <Card>
 *   <p>Content goes here</p>
 * </Card>
 */
export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border bg-cream-50 p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
