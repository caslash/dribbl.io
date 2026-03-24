type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  /** Text label to display — typically a team abbreviation like "LAL" or "BOS". */
  label: string;
  /** Controls padding and font size. Defaults to "md". */
  size?: BadgeSize;
  /** Additional class names. */
  className?: string;
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

/**
 * Compact pill badge for displaying team abbreviations in the career path sequence.
 *
 * @example
 * <Badge label="LAL" />
 * <Badge label="BOS" size="sm" />
 */
export function Badge({ label, size = 'md', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full bg-blue-800 font-mono font-semibold tracking-widest text-white size-fit ${sizeClasses[size]} ${className}`}
    >
      {label}
    </span>
  );
}
