import { useState } from 'react';
import type {
  ButtonHTMLAttributes,
  HTMLAttributes
} from 'react';
import { Icon } from '../foundation/Icon';

export type OrbitalMode = '360' | '3d' | 'ar';

const orbitalLabels: Record<OrbitalMode, string> = {
  '360': '360°',
  '3d': '3D',
  ar: 'AR'
};

export interface OrbitalControlProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-pressed' | 'children'
> {
  mode: OrbitalMode;
  active?: boolean;
}

export function OrbitalControl({
  mode,
  active = false,
  disabled,
  className,
  type = 'button',
  ...props
}: OrbitalControlProps) {
  const rootClassName = [
    'vs-orbital-btn',
    active && 'is-active',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      {...props}
      className={rootClassName}
      type={type}
      disabled={disabled}
      aria-pressed={active}
    >
      <Icon aria-hidden="true">
        {mode === '360' && (
          <>
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </>
        )}
        {mode === '3d' && (
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        )}
        {mode === 'ar' && (
          <>
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect x="8" y="8" width="8" height="8" rx="1" />
          </>
        )}
      </Icon>
      <span>{orbitalLabels[mode]}</span>
    </button>
  );
}

export interface OrbitalControlsProps extends HTMLAttributes<HTMLDivElement> {
  value?: OrbitalMode;
  defaultValue?: OrbitalMode;
  onValueChange?: (mode: OrbitalMode) => void;
  disabled?: boolean;
}

export function OrbitalControls({
  value,
  defaultValue = '3d',
  onValueChange,
  disabled = false,
  className,
  role,
  'aria-label': ariaLabel = 'Viewport mode',
  ...props
}: OrbitalControlsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const rootClassName = [
    'vs-orbital-controls',
    className
  ].filter(Boolean).join(' ');

  const selectMode = (mode: OrbitalMode) => {
    if (disabled) return;
    if (value === undefined) setUncontrolledValue(mode);
    onValueChange?.(mode);
  };

  return (
    <div
      {...props}
      className={rootClassName}
      role={role ?? 'group'}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
    >
      {(['360', '3d', 'ar'] as const).map((mode) => (
        <OrbitalControl
          key={mode}
          mode={mode}
          active={selectedValue === mode}
          disabled={disabled}
          onClick={() => selectMode(mode)}
        />
      ))}
    </div>
  );
}
