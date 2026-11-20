import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode
} from 'react';
import { IconButton } from '../buttons/Buttons';
import { Icon } from '../foundation/Icon';

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role' | 'onClick'> {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  closeLabel?: string;
  onOpenChange?: (open: boolean) => void;
  onClick?: HTMLAttributes<HTMLDivElement>['onClick'];
}

interface DialogSurfaceProps extends DialogProps {
  appearance: 'modal' | 'drawer';
}

function DialogSurface({
  appearance,
  title,
  description,
  children,
  footer,
  open,
  defaultOpen = false,
  closeOnBackdrop = true,
  closeOnEscape = true,
  closeLabel = appearance === 'modal' ? 'Close modal' : 'Close drawer',
  onOpenChange,
  className,
  onClick,
  ...props
}: DialogSurfaceProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const generatedId = useId();
  const titleId = `vs-${appearance}-title-${generatedId}`;
  const descriptionId = `vs-${appearance}-description-${generatedId}`;
  const panelRef = useRef<HTMLDivElement>(null);

  const updateOpen = useCallback((nextOpen: boolean) => {
    if (open === undefined) setUncontrolledOpen(nextOpen);
    if (nextOpen !== isOpen) onOpenChange?.(nextOpen);
  }, [isOpen, onOpenChange, open]);
  const updateOpenRef = useRef(updateOpen);
  const closeOnEscapeRef = useRef(closeOnEscape);

  useEffect(() => {
    updateOpenRef.current = updateOpen;
    closeOnEscapeRef.current = closeOnEscape;
  }, [closeOnEscape, updateOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const activeElement = document.activeElement;
    const returnFocusTarget = activeElement instanceof HTMLElement ? activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscapeRef.current) {
        event.preventDefault();
        event.stopPropagation();
        updateOpenRef.current(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusableElements = Array.from(panel.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.getClientRects().length > 0);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        panel.focus();
      } else if (event.shiftKey && (
        document.activeElement === firstElement || !panel.contains(document.activeElement)
      )) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (
        document.activeElement === lastElement || !panel.contains(document.activeElement)
      )) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = previousBodyOverflow;
      returnFocusTarget?.focus();
    };
  }, [isOpen]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.target === event.currentTarget && closeOnBackdrop) {
      updateOpen(false);
    }
  };

  return (
    <div
      {...props}
      className={[
        `vs-${appearance}-backdrop`,
        isOpen && 'is-open',
        className
      ].filter(Boolean).join(' ')}
      aria-hidden={!isOpen}
      inert={!isOpen}
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        className={`vs-${appearance}-panel`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description === undefined ? undefined : descriptionId}
        tabIndex={-1}
      >
        <header className={`vs-${appearance}__header`}>
          <div className={`vs-${appearance}__heading`}>
            <h2 id={titleId} className={`vs-${appearance}__title`}>{title}</h2>
            {description !== undefined && (
              <p id={descriptionId} className={`vs-${appearance}__description`}>{description}</p>
            )}
          </div>
          <IconButton
            label={closeLabel}
            size="small"
            className={`vs-${appearance}__close`}
            onClick={() => updateOpen(false)}
          >
            <Icon size={14}><path d="M18 6 6 18M6 6l12 12" /></Icon>
          </IconButton>
        </header>
        {children !== undefined && (
          <div className={`vs-${appearance}__content`}>{children}</div>
        )}
        {footer !== undefined && (
          <footer className={`vs-${appearance}__footer`}>{footer}</footer>
        )}
      </div>
    </div>
  );
}

export type ModalProps = DialogProps;

export function Modal(props: ModalProps) {
  return <DialogSurface {...props} appearance="modal" />;
}

export type DrawerProps = DialogProps;

export function Drawer(props: DrawerProps) {
  return <DialogSurface {...props} appearance="drawer" />;
}
