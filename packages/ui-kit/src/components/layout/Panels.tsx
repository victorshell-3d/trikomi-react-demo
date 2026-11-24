import type { CSSProperties } from 'react';
import {
  GlassPanel,
  type GlassPanelProps,
  type PanelRadius
} from '../foundation/Surfaces';

export type SurfacePanelVariant = 'glass' | 'strong' | 'stage' | 'plain';

export interface SurfacePanelProps extends Omit<GlassPanelProps, 'elevation'> {
  variant?: SurfacePanelVariant;
  padding?: CSSProperties['padding'];
  radius?: PanelRadius;
}

export function SurfacePanel({
  variant = 'glass',
  padding = 'var(--vs-space-6)',
  className,
  ...props
}: SurfacePanelProps) {
  const rootClassName = [
    'vs-surface-panel',
    `vs-surface-panel--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return <GlassPanel {...props} padding={padding} className={rootClassName} />;
}

export interface ContentPanelProps extends SurfacePanelProps {
  maxWidth?: CSSProperties['maxWidth'];
}

export function ContentPanel({
  maxWidth = '42rem',
  className,
  style,
  ...props
}: ContentPanelProps) {
  const rootClassName = ['vs-content-panel', className].filter(Boolean).join(' ');
  const rootStyle = {
    maxWidth,
    width: '100%',
    marginInline: 'auto',
    ...style
  };

  return (
    <SurfacePanel
      {...props}
      className={rootClassName}
      style={rootStyle}
    />
  );
}

export type ElevatedPanelProps = GlassPanelProps;

export function ElevatedPanel({
  padding = 'var(--vs-space-6)',
  elevation = 'float',
  className,
  ...props
}: ElevatedPanelProps) {
  const rootClassName = ['vs-elevated-panel', className].filter(Boolean).join(' ');

  return (
    <GlassPanel
      {...props}
      padding={padding}
      elevation={elevation}
      className={rootClassName}
    />
  );
}
