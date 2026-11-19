import type { MouseEventHandler } from 'react';
import { Tooltip } from '../overlays/Tooltip';
import type { TooltipPlacement } from '../overlays/positioning';

export interface HotspotMarkerProps {
  label: string;
  onActivate?: MouseEventHandler<HTMLButtonElement>;
  placement?: TooltipPlacement;
  portalContainer?: Element | null;
  className?: string;
}

export function HotspotMarker({
  label,
  onActivate,
  placement = 'top',
  portalContainer,
  className
}: HotspotMarkerProps) {
  return (
    <Tooltip
      content={label}
      placement={placement}
      portalContainer={portalContainer}
    >
      {(triggerProps) => (
        <button
          {...triggerProps}
          className={['vs-hotspot-ring', className].filter(Boolean).join(' ')}
          type="button"
          aria-label={label}
          onClick={onActivate}
        />
      )}
    </Tooltip>
  );
}
