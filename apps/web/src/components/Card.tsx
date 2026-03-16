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
      className={`rounded-lg border border-border bg-surface-raised p-6 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
