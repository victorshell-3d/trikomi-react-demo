import { useEffect, useState, type RefObject } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type FloatingPlacement = TooltipPlacement | 'top-end' | 'bottom-end';

export interface FloatingPosition {
  top: number;
  left: number;
  placement: FloatingPlacement;
}

interface FloatingPositionOptions {
  open: boolean;
  placement: FloatingPlacement;
  offset: number;
  portalContainer?: Element | null;
  anchorRef: RefObject<HTMLElement | null>;
  layerRef: RefObject<HTMLElement | null>;
}

function oppositePlacement(placement: FloatingPlacement): FloatingPlacement {
  switch (placement) {
    case 'top':
      return 'bottom';
    case 'bottom':
      return 'top';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    case 'top-end':
      return 'bottom-end';
    case 'bottom-end':
      return 'top-end';
  }
}

function fitsViewport(
  placement: FloatingPlacement,
  anchor: DOMRect,
  layer: DOMRect,
  offset: number,
  viewportWidth: number,
  viewportHeight: number
) {
  const margin = 8;
  if (placement.startsWith('top')) {
    return anchor.top - layer.height - offset >= margin;
  }
  if (placement.startsWith('bottom')) {
    return anchor.bottom + layer.height + offset <= viewportHeight - margin;
  }
  if (placement === 'left') {
    return anchor.left - layer.width - offset >= margin;
  }
  return anchor.right + layer.width + offset <= viewportWidth - margin;
}

export function calculateFloatingPosition(
  anchor: DOMRect,
  layer: DOMRect,
  requestedPlacement: FloatingPlacement,
  offset: number,
  viewportWidth: number,
  viewportHeight: number
): FloatingPosition {
  const opposite = oppositePlacement(requestedPlacement);
  const placement = fitsViewport(
    requestedPlacement,
    anchor,
    layer,
    offset,
    viewportWidth,
    viewportHeight
  ) || !fitsViewport(opposite, anchor, layer, offset, viewportWidth, viewportHeight)
    ? requestedPlacement
    : opposite;
  const side = placement.split('-')[0];
  const alignEnd = placement.endsWith('-end');
  let top = side === 'top'
    ? anchor.top - layer.height - offset
    : side === 'bottom'
      ? anchor.bottom + offset
      : anchor.top + (anchor.height - layer.height) / 2;
  let left = side === 'left'
    ? anchor.left - layer.width - offset
    : side === 'right'
      ? anchor.right + offset
      : alignEnd
        ? anchor.right - layer.width
        : anchor.left + (anchor.width - layer.width) / 2;
  const margin = 8;

  top = Math.max(margin, Math.min(top, viewportHeight - layer.height - margin));
  left = Math.max(margin, Math.min(left, viewportWidth - layer.width - margin));

  return { top, left, placement };
}

export function useFloatingPosition({
  open,
  placement,
  offset,
  portalContainer,
  anchorRef,
  layerRef
}: FloatingPositionOptions): FloatingPosition | null {
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  useEffect(() => {
    if (!open || !portalContainer) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const layer = layerRef.current;
      if (!anchor || !layer) return;
      setPosition(calculateFloatingPosition(
        anchor.getBoundingClientRect(),
        layer.getBoundingClientRect(),
        placement,
        offset,
        window.innerWidth,
        window.innerHeight
      ));
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(updatePosition);
    if (resizeObserver) {
      if (anchorRef.current) resizeObserver.observe(anchorRef.current);
      if (layerRef.current) resizeObserver.observe(layerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      resizeObserver?.disconnect();
    };
  }, [open, placement, offset, portalContainer, anchorRef, layerRef]);

  return position;
}
