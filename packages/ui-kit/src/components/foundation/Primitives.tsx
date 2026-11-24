import type {
  HTMLAttributes,
  ReactNode
} from 'react';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({
  orientation = 'horizontal',
  className,
  ...props
}: DividerProps) {
  const rootClassName = [
    'vs-divider',
    `vs-divider--${orientation}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      {...props}
      className={rootClassName}
      role="separator"
      aria-orientation={orientation}
    />
  );
}

export type BadgeVariant = 'neutral' | 'accent';
export type BadgeSize = 'small' | 'medium';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export function Badge({
  variant = 'neutral',
  size = 'small',
  className,
  children,
  ...props
}: BadgeProps) {
  const rootClassName = [
    'vs-badge',
    `vs-badge--${variant}`,
    `vs-badge--${size}`,
    className
  ].filter(Boolean).join(' ');

  return <span {...props} className={rootClassName}>{children}</span>;
}

export type Status = 'success' | 'warning' | 'error' | 'info';

export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  status?: Status;
  label?: ReactNode;
}

export function StatusIndicator({
  status = 'success',
  label,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role,
  ...props
}: StatusIndicatorProps) {
  const rootClassName = [
    'vs-status-indicator',
    `vs-status-indicator--${status}`,
    className
  ].filter(Boolean).join(' ');
  const hasVisibleLabel = label !== undefined;
  const decorative = ariaHidden ?? (!hasVisibleLabel && !ariaLabel);

  return (
    <span
      {...props}
      className={rootClassName}
      aria-hidden={decorative}
      aria-label={ariaLabel}
      role={role ?? (!hasVisibleLabel && ariaLabel ? 'img' : undefined)}
    >
      <span className="vs-status-indicator__dot" aria-hidden="true" />
      {label !== undefined && (
        <span className="vs-status-indicator__label">{label}</span>
      )}
    </span>
  );
}
