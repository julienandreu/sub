import classNames from 'classnames';
import { forwardRef, type HTMLAttributes } from 'preact/compat';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large';
  variant?: 'regular' | 'mono';
}

function getSize(size: LogoProps['size']): string {
  switch (size) {
    case 'small':
      return classNames('w-4', 'h-4');
    case 'medium':
      return classNames('w-8', 'h-8');
    case 'large':
      return classNames('w-12', 'h-12');
    default:
      return classNames('w-8', 'h-8');
  }
}

function getImage(
  size: LogoProps['size'],
  variant: LogoProps['variant'],
): string {
  switch (size) {
    case 'small':
      return `/icons/${String(variant)}/24x24.png`;
    case 'medium':
      return `/icons/${String(variant)}/48x48.png`;
    case 'large':
      return `/icons/${String(variant)}/1024x1024.png`;
    default:
      return `/icons/${String(variant)}/48x48.png`;
  }
}

const Logo = forwardRef<HTMLDivElement, LogoProps>((
  {
    size = 'medium',
    variant = 'regular',
    ...props
  },
  ref
) => (
  <div
    className={classNames(
      getSize(size),
      getImage(size, variant),
    )}
    ref={ref}
    {...props}
  >
    <img src={getImage(size, variant)} alt="Saris AI" />
  </div>
));

export default Logo;
