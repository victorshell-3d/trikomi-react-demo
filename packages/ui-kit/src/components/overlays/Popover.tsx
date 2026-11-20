import { createPortal } from 'react-dom';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import { Button } from '../buttons/Buttons';
import { useFloatingPosition } from './positioning';

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  triggerLabel: string;
  triggerContent?: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  portalContainer?: Element | null;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  label,
  triggerLabel,
  triggerContent = 'Toggle Popover',
  children,
  open,
  defaultOpen = false,
  portalContainer,
  onOpenChange,
  className,
  ...rootProps
}: PopoverProps) {
  const generatedId = useId();
  const panelId = `vs-popover-${generatedId}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const position = useFloatingPosition({
    open: isOpen,
    placement: 'top-end',
    offset: 10,
    portalContainer,
    anchorRef: rootRef,
    layerRef: panelRef
  });

  const updateOpen = useCallback((nextOpen: boolean, returnFocus = false) => {
    if (nextOpen === isOpen) {
      if (!nextOpen && returnFocus) {
        rootRef.current?.querySelector<HTMLButtonElement>('.vs-popover-trigger')?.focus();
      }
      return;
    }
    if (open === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen && returnFocus) {
      rootRef.current?.querySelector<HTMLButtonElement>('.vs-popover-trigger')?.focus();
    }
  }, [isOpen, onOpenChange, open]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      updateOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      updateOpen(false, true);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, updateOpen]);

  const panelElement = (
    <div
      ref={panelRef}
      id={panelId}
      className={[
        'vs-popover-panel',
        isOpen && 'is-open',
        portalContainer && isOpen && 'vs-popover-panel--portal',
        position?.placement === 'bottom-end' && 'is-below'
      ].filter(Boolean).join(' ')}
      role="dialog"
      aria-label={label}
      aria-hidden={!isOpen}
      tabIndex={-1}
      style={portalContainer && isOpen
        ? {
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          visibility: position ? undefined : 'hidden'
        }
        : undefined}
    >
      {children}
    </div>
  );
  const renderedPanel = portalContainer && isOpen
    ? createPortal(panelElement, portalContainer)
    : panelElement;

  return (
    <div
      {...rootProps}
      ref={rootRef}
      className={['vs-popover', className].filter(Boolean).join(' ')}
    >
      <Button
        variant="tonal"
        className="vs-popover-trigger"
        type="button"
        aria-label={triggerLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => updateOpen(!isOpen)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !isOpen) {
            event.preventDefault();
            updateOpen(true);
            window.requestAnimationFrame(() => panelRef.current?.focus());
          }
        }}
      >
        {triggerContent}
      </Button>
      {renderedPanel}
    </div>
  );
}
