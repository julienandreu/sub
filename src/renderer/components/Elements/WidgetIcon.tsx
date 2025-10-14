import classNames from 'classnames';
import { forwardRef, type HTMLAttributes } from 'preact/compat';

const WidgetIcon = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((
  props,
  ref
) => (
  <div
    className={classNames(
      'w-12',
      'h-12',
      'bg-background',
      'border-border-tertiary',
      'border-2',
      'shadow-md',
      'rounded-full',
      'flex',
      'items-center',
      'justify-center',
      'cursor-pointer',
      'no-select',
      'relative',
    )}
    ref={ref}
    {...props}
  >
    {props.children}
  </div>
));

export default WidgetIcon;
