import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: ButtonVariant;
  /** Size of the button. */
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-burgundy-600 text-cream-50 hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'border border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-cream-50 dark:border-cream-200 dark:text-cream-200 dark:hover:bg-cream-200 dark:hover:text-navy-900 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'text-navy-800 hover:bg-navy-800/10 dark:text-cream-200 dark:hover:bg-cream-200/10 disabled:opacity-50 disabled:cursor-not-allowed',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * General-purpose button with variant and size support.
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>Start Game</Button>
 * <Button variant="secondary" size="sm">Cancel</Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy-600 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
