import type { CSSProperties, HTMLAttributes } from 'react';

export type PanelRadius = 'control' | 'card' | 'stage' | 'menu' | 'rail' | 'pill';
export type PanelElevation = 'ambient' | 'float' | 'none';

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CSSProperties['padding'];
  radius?: PanelRadius;
  elevation?: PanelElevation;
}

export function GlassPanel({
  padding,
  radius,
  elevation = 'ambient',
  className,
  style,
  ...props
}: GlassPanelProps) {
  const rootClassName = [
    'vs-glass-panel',
    elevation !== 'ambient' && `vs-panel-elevation--${elevation}`,
    className
  ].filter(Boolean).join(' ');
  const rootStyle = {
    ...(padding !== undefined ? { padding } : {}),
    ...(radius ? { borderRadius: `var(--vs-radius-${radius})` } : {}),
    ...style
  };

  return <div {...props} className={rootClassName} style={rootStyle} />;
}

export type SurfaceVariant = 'none' | 'glass' | 'strong' | 'stage';

export interface SurfaceContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
}

export function SurfaceContainer({
  variant = 'none',
  className,
  ...props
}: SurfaceContainerProps) {
  const rootClassName = [
    'vs-surface-container',
    variant !== 'none' && `vs-surface-container--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return <div {...props} className={rootClassName} />;
}
