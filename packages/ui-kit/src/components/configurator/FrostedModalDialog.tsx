import React, {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type CSSProperties,
  type MouseEvent
} from 'react';

export const FOCUSABLE_ELEMENTS_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

export interface FrostedModalDialogProps {
  title: ReactNode;
  subtitle?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  children: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const FrostedModalDialog: React.FC<FrostedModalDialogProps> = ({
  title,
  subtitle,
  isOpen,
  onClose,
  size = 'md',
  children,
  footer,
  closeOnBackdrop = true,
  closeOnEscape = true,
  trapFocus = true,
  restoreFocus = true,
  className = '',
  style
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const id = useId();
  const titleId = `vs-modal-title-${id}`;
  const subtitleId = subtitle ? `vs-modal-subtitle-${id}` : undefined;

  // 1. Focus Restoration: store activeElement on open, restore on close
  useEffect(() => {
    if (!restoreFocus || typeof document === 'undefined') return;

    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    } else if (previousActiveElementRef.current) {
      const elToFocus = previousActiveElementRef.current;
      previousActiveElementRef.current = null;
      if (typeof elToFocus.focus === 'function') {
        elToFocus.focus();
      }
    }
  }, [isOpen, restoreFocus]);

  // Clean-up restoration on unmount if component unmounts while open
  useEffect(() => {
    return () => {
      if (restoreFocus && previousActiveElementRef.current) {
        if (typeof previousActiveElementRef.current.focus === 'function') {
          previousActiveElementRef.current.focus();
        }
        previousActiveElementRef.current = null;
      }
    };
  }, [restoreFocus]);

  // 2. Initial Focus when dialog opens
  useEffect(() => {
    if (!isOpen || !trapFocus || typeof document === 'undefined') return;

    const timer = setTimeout(() => {
      if (!dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialogRef.current.focus();
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [isOpen, trapFocus]);

  // 3. Escape key & Keyboard Focus Trapping (Tab / Shift+Tab)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape handling
      if (e.key === 'Escape' && closeOnEscape) {
        e.stopPropagation();
        onClose();
        return;
      }

      // Keyboard Focus Trapping
      if (e.key === 'Tab' && trapFocus && dialogRef.current) {
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR)
        ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');

        if (focusableElements.length === 0) {
          e.preventDefault();
          dialogRef.current.focus();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeEl = document.activeElement;

        if (e.shiftKey) {
          // Shift + Tab: if focus is on first element or outside dialog, wrap to last
          if (activeEl === firstElement || !dialogRef.current.contains(activeEl)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if focus is on last element or outside dialog, wrap to first
          if (activeEl === lastElement || !dialogRef.current.contains(activeEl)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, trapFocus, onClose]);

  // 4. Lock body scroll when open
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="vs-frosted-modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={`vs-frosted-modal-dialog vs-frosted-modal-dialog--${size} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
        tabIndex={-1}
        style={style}
      >
        {/* Header */}
        <div className="vs-frosted-modal-dialog__header">
          <div className="vs-frosted-modal-dialog__titles">
            <h2 id={titleId} className="vs-frosted-modal-dialog__title">
              {title}
            </h2>
            {subtitle && (
              <p id={subtitleId} className="vs-frosted-modal-dialog__subtitle">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            className="vs-frosted-modal-dialog__close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="12" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body Content */}
        <div className="vs-frosted-modal-dialog__body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="vs-frosted-modal-dialog__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
