import classNames from 'classnames';
import { forwardRef, type HTMLAttributes } from 'preact/compat';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'error' | 'warning' | 'success' | 'info';
  count?: number;
  visible?: boolean;
}

function getColors(variant: BadgeProps['variant']): string {
  switch (variant) {
    case 'error':
      return classNames('bg-background-error', 'text-white');
    case 'warning':
      return classNames('bg-background-warning', 'text-white');
    case 'success':
      return classNames('bg-background-success', 'text-white');
    case 'info':
      return classNames('bg-background-info', 'text-white');
    default:
      return '';
  }
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>((
  {
    variant = 'error',
    count = 0,
    hidden = false,
    ...props
  },
  ref
) => (
  <div
    className={classNames(
      'w-4',
      'h-4',
      getColors(variant),
      'text-white',
      'rounded-full',
      'flex',
      'items-center',
      'justify-center',
      'cursor-pointer',
      'no-select',
      'absolute',
      'bottom-2',
      'right-2',
      'text-xs',
      'z-50',
      'pointer-events-none',
      hidden && 'hidden',
    )}
    ref={ref}
    {...props}
  >
    {count}
  </div>
));

export default Badge;
