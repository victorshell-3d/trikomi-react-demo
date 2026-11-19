import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} btn-sm ${className}`}
      {...props}
    />
  );
}
export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg aria-hidden="true" className={className}>
      <use href={`#i-${name}`} />
    </svg>
  );
}
export function IconButton({
  icon,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="icon-btn"
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}
export function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="wk-field">
      <span>{label}</span>
      {children}
      {(error || hint) && (
        <small className={error ? "wk-error" : ""}>{error || hint}</small>
      )}
    </label>
  );
}
export function TextField({
  label,
  hint,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  const id = useId();
  return (
    <label className="wk-field">
      <span>{label}</span>
      <input
        {...props}
        aria-invalid={!!error}
        aria-describedby={hint || error ? id : undefined}
      />
      {(hint || error) && (
        <small id={id} className={error ? "wk-error" : ""}>
          {error || hint}
        </small>
      )}
    </label>
  );
}
export function Select({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Field label={label}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </Field>
  );
}
export function Range({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <Field label={label}>
      <span className="wk-range">
        <input
          aria-label={label}
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(+e.target.value)}
          disabled={disabled}
        />
        <output htmlFor={id}>{value}</output>
      </span>
    </Field>
  );
}
export function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <button
        type="button"
        className={`toggle ${checked ? "is-on" : ""}`}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        <i />
      </button>
    </label>
  );
}
export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  disabledOptions = [],
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  disabledOptions?: readonly string[];
}) {
  return (
    <div className="wk-segments" role="group" aria-label={label}>
      {options.map((v) => (
        <button
          key={v}
          type="button"
          disabled={disabledOptions.includes(v)}
          aria-pressed={value === v}
          className={value === v ? "selected" : ""}
          onClick={() => onChange(v)}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
export function Swatches({
  label,
  colors,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  colors: readonly string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="swatch-field">
      <p className="wk-note">{label}</p>
      <div className="wk-color-row" role="group" aria-label={label}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            disabled={disabled}
            aria-label={`${label} ${color}`}
            aria-pressed={value === color}
            className={value === color ? "selected" : ""}
            style={{ "--sample": color } as CSSProperties}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  children,
  drawer = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      [
        ...dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex="0"]',
        ),
      ].filter((el) => el.getClientRects().length);
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables(),
        first = items[0],
        last = items[items.length - 1];
      if (!first) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.showModal();
    dialog.addEventListener("keydown", trap);
    return () => {
      dialog.removeEventListener("keydown", trap);
      dialog.close();
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`react-dialog glass ${drawer ? "react-drawer" : ""}`}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <header className="modal-head">
        <h3 id={titleId}>{title}</h3>
        <IconButton icon="close" label={`Close ${title}`} onClick={onClose} />
      </header>
      {children}
    </dialog>
  );
}
