import { createPortal } from 'react-dom';
import {
  useId,
  useRef,
  useState,
  type FocusEvent,
  type FocusEventHandler,
  type HTMLAttributes,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode
} from 'react';
import { useFloatingPosition, type TooltipPlacement } from './positioning';

export interface TooltipTriggerProps {
  'aria-describedby'?: string;
  onBlur: FocusEventHandler<HTMLElement>;
  onFocus: FocusEventHandler<HTMLElement>;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
  onMouseEnter: MouseEventHandler<HTMLElement>;
  onMouseLeave: MouseEventHandler<HTMLElement>;
}

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  content: string;
  placement?: TooltipPlacement;
  children: (triggerProps: TooltipTriggerProps) => ReactNode;
  portalContainer?: Element | null;
}

export function Tooltip({
  content,
  placement = 'top',
  children,
  portalContainer,
  className,
  ...wrapperProps
}: TooltipProps) {
  const generatedId = useId();
  const tooltipId = `vs-tooltip-${generatedId}`;
  const rootRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const isOpen = (hovered || focused) && !dismissed;
  const position = useFloatingPosition({
    open: isOpen,
    placement,
    offset: 8,
    portalContainer,
    anchorRef: rootRef,
    layerRef: tooltipRef
  });

  const triggerProps: TooltipTriggerProps = {
    'aria-describedby': isOpen ? tooltipId : undefined,
    onMouseEnter: () => {
      setHovered(true);
      setDismissed(false);
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
      setHovered(false);
    },
    onFocus: () => {
      setFocused(true);
      setDismissed(false);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
      setFocused(false);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        event.stopPropagation();
        setDismissed(true);
      }
    }
  };

  const tooltipElement = (
    <span
      ref={tooltipRef}
      id={tooltipId}
      className={[
        'vs-tooltip-bubble',
        isOpen && 'is-visible',
        portalContainer && isOpen && 'vs-tooltip-bubble--portal'
      ].filter(Boolean).join(' ')}
      role="tooltip"
      aria-hidden={!isOpen}
      data-placement={position?.placement ?? placement}
      style={portalContainer && isOpen
        ? {
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          visibility: position ? undefined : 'hidden'
        }
        : undefined}
    >
      {content}
    </span>
  );
  const renderedTooltip = portalContainer && isOpen
    ? createPortal(tooltipElement, portalContainer)
    : tooltipElement;

  return (
    <span
      {...wrapperProps}
      ref={rootRef}
      className={['vs-tooltip', className].filter(Boolean).join(' ')}
      data-vs-tip={content}
      data-vs-tip-pos={placement}
    >
      {children(triggerProps)}
      {renderedTooltip}
    </span>
  );
}
