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
      className={`w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-navy-900 placeholder:text-slate-400 focus:border-burgundy-600 focus:outline-none focus:ring-2 focus:ring-burgundy-600/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-cream-100 dark:placeholder:text-slate-500 dark:focus:border-burgundy-500 ${className}`}
      {...props}
    />
  );
}
