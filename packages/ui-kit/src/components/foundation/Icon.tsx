import type { ReactNode, SVGProps } from 'react';

export interface IconProps extends Omit<
  SVGProps<SVGSVGElement>,
  'children' | 'height' | 'width'
> {
  children: ReactNode;
  size?: number | string;
  title?: string;
}

export function Icon({
  children,
  size = 18,
  title,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role,
  viewBox = '0 0 24 24',
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = 1.75,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  focusable = 'false',
  ...props
}: IconProps) {
  const decorative = ariaHidden ?? (!ariaLabel && !title);
  const rootClassName = ['vs-icon', className].filter(Boolean).join(' ');

  return (
    <svg
      {...props}
      className={rootClassName}
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      focusable={focusable}
      aria-hidden={decorative}
      aria-label={ariaLabel ?? title}
      role={role ?? (decorative ? undefined : 'img')}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}
