import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Additional class names to merge onto the input element. */
  className?: string;
}

/**
 * Styled text input with consistent border, focus ring, and dark mode support.
 *
 * @example
 * <Input placeholder="Search players..." value={query} onChange={handleChange} />
 */
export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-text-primary placeholder:text-text-placeholder focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
