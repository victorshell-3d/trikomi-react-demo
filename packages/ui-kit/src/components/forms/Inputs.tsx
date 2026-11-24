import {
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes
} from 'react';
import { Icon } from '../foundation/Icon';
import { Label } from '../foundation/Typography';
import {
  useFormFieldContext,
  type FormFieldRules
} from './FormField';

export type FormInputStatus = 'active' | 'error' | 'success';
export type TextInputType = 'text' | 'email' | 'password' | 'search';

function mergeIds(...ids: Array<string | undefined>) {
  return Array.from(new Set(ids.filter(Boolean))).join(' ') || undefined;
}

function getLimitValue(limit: FormFieldRules['minLength']) {
  if (limit == null) return undefined;
  return typeof limit === 'number' ? limit : limit.value;
}

function getControlClassName(
  baseClass: string,
  className: string | undefined,
  status: FormInputStatus | undefined,
  hasError: boolean,
  success: boolean
) {
  return [
    baseClass,
    status === 'active' && 'is-active-state',
    (status === 'error' || hasError) && 'is-error-state',
    status === 'success' || success ? 'is-success-state' : undefined,
    className
  ].filter(Boolean).join(' ');
}

interface InputControlProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type: TextInputType | 'number' | 'range';
  status?: FormInputStatus;
  baseClass?: string;
}

function InputControl({
  type,
  status,
  baseClass = 'vs-input',
  className,
  id,
  required,
  disabled,
  min,
  max,
  minLength,
  maxLength,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  onChange,
  onBlur,
  onInvalid,
  ...props
}: InputControlProps) {
  const field = useFormFieldContext();
  const hasError = Boolean(field?.hasError || ariaInvalid === true || status === 'error');
  const success = Boolean(!hasError && (field?.success || status === 'success'));
  const resolvedMin = min ?? (type === 'number' || type === 'range' ? getLimitValue(field?.rules.min) : undefined);
  const resolvedMax = max ?? (type === 'number' || type === 'range' ? getLimitValue(field?.rules.max) : undefined);
  const resolvedMinLength = minLength ?? getLimitValue(field?.rules.minLength);
  const resolvedMaxLength = maxLength ?? getLimitValue(field?.rules.maxLength);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    field?.onChange(event.currentTarget.value, type);
    onChange?.(event);
  };
  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    field?.onBlur(event.currentTarget.value, type);
    onBlur?.(event);
  };
  const handleInvalid = (event: FormEvent<HTMLInputElement>) => {
    field?.onBlur(event.currentTarget.value, type);
    onInvalid?.(event);
  };

  return (
    <input
      {...props}
      id={id ?? field?.controlId}
      type={type}
      className={getControlClassName(baseClass, className, status, hasError, success)}
      required={Boolean(required || field?.required)}
      disabled={Boolean(disabled || field?.disabled)}
      min={resolvedMin}
      max={resolvedMax}
      minLength={resolvedMinLength}
      maxLength={resolvedMaxLength}
      aria-describedby={mergeIds(ariaDescribedBy, field?.describedBy)}
      aria-invalid={hasError ? true : ariaInvalid}
      aria-errormessage={field?.errorId}
      onChange={handleChange}
      onBlur={handleBlur}
      onInvalid={handleInvalid}
    />
  );
}

export interface TextInputProps extends Omit<InputControlProps, 'type' | 'baseClass'> {
  type?: TextInputType;
}

export function TextInput({
  type = 'text',
  ...props
}: TextInputProps) {
  return <InputControl {...props} type={type} />;
}

export type EmailInputProps = Omit<TextInputProps, 'type'>;

export function EmailInput(props: EmailInputProps) {
  return <TextInput {...props} type="email" />;
}

export function PasswordInput(props: EmailInputProps) {
  return <TextInput {...props} type="password" autoComplete={props.autoComplete ?? 'current-password'} />;
}

export type NumberInputProps = Omit<InputControlProps, 'type' | 'baseClass'>;

export function NumberInput(props: NumberInputProps) {
  return <InputControl {...props} type="number" />;
}

export interface SearchInputProps extends TextInputProps {
  shortcut?: string | null;
  wrapperClassName?: string;
}

export function SearchInput({
  shortcut = '⌘K',
  wrapperClassName,
  className,
  ...props
}: SearchInputProps) {
  return (
    <span className={['vs-search-input-wrap', wrapperClassName].filter(Boolean).join(' ')}>
      <Icon className="vs-search-input__icon" size={16}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </Icon>
      <TextInput {...props} type="search" className={['vs-search-input', className].filter(Boolean).join(' ')} />
      {shortcut && <kbd className="vs-search-input__shortcut" aria-hidden="true">{shortcut}</kbd>}
    </span>
  );
}

export interface FloatingLabelInputProps extends TextInputProps {
  label: string;
}

export function FloatingLabelInput({
  label,
  id,
  className,
  required,
  ...props
}: FloatingLabelInputProps) {
  const generatedId = useId();
  const field = useFormFieldContext();
  const inputId = id ?? field?.controlId ?? `vs-float-${generatedId}`;
  const isRequired = Boolean(required || field?.required);

  return (
    <div className="vs-float-wrap">
      <Label htmlFor={inputId} className="vs-float-label">
        {label}
        {isRequired && <span className="vs-form-field__required" aria-hidden="true"> *</span>}
      </Label>
      <TextInput
        {...props}
        id={inputId}
        required={isRequired}
        className={['vs-float-input', className].filter(Boolean).join(' ')}
      />
    </div>
  );
}

export interface InputGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'aria-labelledby' | 'role'> {
  label?: string;
}

export function InputGroup({
  label,
  className,
  children,
  ...props
}: InputGroupProps) {
  const field = useFormFieldContext();

  return (
    <div
      {...props}
      className={[
        'vs-input-group',
        field?.hasError && 'is-error-state',
        field?.success && 'is-success-state',
        field?.disabled && 'is-disabled-state',
        className
      ].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
      aria-labelledby={label ? undefined : field?.labelId}
    >
      {children}
    </div>
  );
}

export type InputAddonProps = HTMLAttributes<HTMLSpanElement>;

export function InputAddon({ className, ...props }: InputAddonProps) {
  return <span {...props} className={['vs-input-addon', className].filter(Boolean).join(' ')} />;
}

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  status?: FormInputStatus;
  showCharacterCount?: boolean;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({
  status,
  showCharacterCount,
  className,
  id,
  required,
  disabled,
  minLength,
  maxLength,
  value,
  defaultValue,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  onChange,
  onBlur,
  onInvalid,
  rows = 2,
  ...props
}: TextareaProps) {
  const field = useFormFieldContext();
  const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue ?? ''));
  const currentValue = value === undefined ? uncontrolledValue : String(value ?? '');
  const resolvedMaxLength = maxLength ?? getLimitValue(field?.rules.maxLength);
  const resolvedMinLength = minLength ?? getLimitValue(field?.rules.minLength);
  const hasError = Boolean(field?.hasError || ariaInvalid === true || status === 'error');
  const success = Boolean(!hasError && (field?.success || status === 'success'));
  const showCounter = showCharacterCount ?? resolvedMaxLength !== undefined;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.currentTarget.value;
    if (value === undefined) setUncontrolledValue(nextValue);
    field?.onChange(nextValue, 'text');
    onChange?.(event);
  };
  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    field?.onBlur(event.currentTarget.value, 'text');
    onBlur?.(event);
  };
  const handleInvalid = (event: FormEvent<HTMLTextAreaElement>) => {
    field?.onBlur(event.currentTarget.value, 'text');
    onInvalid?.(event);
  };

  return (
    <div className="vs-textarea-wrap">
      {showCounter && resolvedMaxLength !== undefined && (
        <output className="vs-textarea__count" aria-live="polite">
          {currentValue.length} / {resolvedMaxLength}
        </output>
      )}
      <textarea
        {...props}
        id={id ?? field?.controlId}
        rows={rows}
        className={getControlClassName('vs-input vs-textarea', className, status, hasError, success)}
        required={Boolean(required || field?.required)}
        disabled={Boolean(disabled || field?.disabled)}
        minLength={resolvedMinLength}
        maxLength={resolvedMaxLength}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        aria-describedby={mergeIds(ariaDescribedBy, field?.describedBy)}
        aria-invalid={hasError ? true : ariaInvalid}
        aria-errormessage={field?.errorId}
        onChange={handleChange}
        onBlur={handleBlur}
        onInvalid={handleInvalid}
      />
    </div>
  );
}

export interface RangeSliderProps extends Omit<InputControlProps, 'type' | 'baseClass'> {
  showValue?: boolean;
  formatValue?: (value: number) => ReactNode;
}

function normalizeRangeValue(
  value: number,
  min: number | string,
  max: number | string,
  step: number | string
) {
  const minValue = Number(min);
  const maxValue = Number(max);
  const lowerBound = Number.isFinite(minValue) ? minValue : 0;
  const upperBound = Number.isFinite(maxValue) ? Math.max(lowerBound, maxValue) : 100;
  const numericValue = Number.isFinite(value) ? value : lowerBound;
  const clampedValue = Math.min(upperBound, Math.max(lowerBound, numericValue));
  const stepValue = Number(step);

  if (step === 'any' || !Number.isFinite(stepValue) || stepValue <= 0) return clampedValue;

  const steppedValue = lowerBound + Math.round((clampedValue - lowerBound) / stepValue) * stepValue;
  return Number(Math.min(upperBound, steppedValue).toFixed(10));
}

export function RangeSlider({
  showValue = true,
  formatValue = (value) => `${value}%`,
  value,
  defaultValue = 82,
  min,
  max,
  step = 1,
  className,
  onChange,
  ...props
}: RangeSliderProps) {
  const field = useFormFieldContext();
  const resolvedMin = min ?? getLimitValue(field?.rules.min) ?? 0;
  const resolvedMax = max ?? getLimitValue(field?.rules.max) ?? 100;
  const [uncontrolledValue, setUncontrolledValue] = useState(() => (
    normalizeRangeValue(Number(defaultValue), resolvedMin, resolvedMax, step)
  ));
  const currentValue = normalizeRangeValue(
    Number(value ?? uncontrolledValue),
    resolvedMin,
    resolvedMax,
    step
  );

  return (
    <div className="vs-range-control">
      {showValue && (
        <output className="vs-range-control__value">
          {formatValue(Number.isFinite(currentValue) ? currentValue : 0)}
        </output>
      )}
      <InputControl
        {...props}
        type="range"
        baseClass="vs-slider"
        min={resolvedMin}
        max={resolvedMax}
        step={step}
        value={currentValue}
        className={className}
        onChange={(event) => {
          if (value === undefined) setUncontrolledValue(Number(event.currentTarget.value));
          onChange?.(event);
        }}
      />
    </div>
  );
}
