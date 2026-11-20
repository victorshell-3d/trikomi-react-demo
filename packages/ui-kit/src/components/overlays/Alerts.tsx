import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import { Icon } from '../foundation/Icon';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role'> {
  variant?: AlertVariant;
  title: string;
  description: ReactNode;
  dismissible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onDismiss?: () => void;
}

const alertIcons: Record<AlertVariant, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '×'
};

export function Alert({
  variant = 'info',
  title,
  description,
  dismissible = true,
  open,
  defaultOpen = true,
  onDismiss,
  className,
  ...props
}: AlertProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const generatedId = useId();
  const titleId = `vs-alert-title-${generatedId}`;
  const descriptionId = `vs-alert-description-${generatedId}`;

  if (!isOpen) return null;

  const dismiss = () => {
    if (open === undefined) setUncontrolledOpen(false);
    onDismiss?.();
  };

  return (
    <div
      {...props}
      className={[
        'vs-alert',
        `vs-alert--${variant}`,
        className
      ].filter(Boolean).join(' ')}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <span className="vs-alert__icon" aria-hidden="true">{alertIcons[variant]}</span>
      <span className="vs-alert__content">
        <strong className="vs-alert__title" id={titleId}>{title}:</strong>{' '}
        <span className="vs-alert__description" id={descriptionId}>{description}</span>
      </span>
      {dismissible && (
        <button
          type="button"
          className="vs-alert__dismiss"
          aria-label={`Dismiss ${title} alert`}
          onClick={dismiss}
        >
          <Icon size={14}><path d="M18 6 6 18M6 6l12 12" /></Icon>
        </button>
      )}
    </div>
  );
}

type ToastContextValue = (message: string) => void;

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((nextMessage: string) => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    setMessage(nextMessage);
    timeoutRef.current = setTimeout(() => {
      setMessage(null);
      timeoutRef.current = null;
    }, 2500);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        className={['vs-toast', message !== null && 'is-visible'].filter(Boolean).join(' ')}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-hidden={message === null}
      >
        <span className="vs-pulse-emerald" aria-hidden="true" />
        <span className="vs-toast__message">{message}</span>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return showToast;
}
