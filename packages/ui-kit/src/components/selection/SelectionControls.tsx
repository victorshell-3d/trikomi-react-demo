import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode
} from 'react';

function combineIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(' ') || undefined;
}

interface ChoiceCopyProps {
  label?: ReactNode;
  labelId?: string;
  description?: ReactNode;
  descriptionId?: string;
}

function ChoiceCopy({
  label,
  labelId,
  description,
  descriptionId
}: ChoiceCopyProps) {
  if (label == null && description == null) return null;

  return (
    <span className="vs-choice__copy">
      {label != null && (
        <span className="vs-choice__label" id={labelId}>
          {label}
        </span>
      )}
      {description != null && (
        <span className="vs-choice__description" id={descriptionId}>
          {description}
        </span>
      )}
    </span>
  );
}

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className' | 'aria-checked'
> {
  label?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  className?: string;
  inputClassName?: string;
}

export function Checkbox({
  label,
  description,
  indeterminate = false,
  className,
  inputClassName,
  id,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = label == null ? undefined : `${inputId}-label`;
  const descriptionId = description == null ? undefined : `${inputId}-description`;
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  return (
    <label
      className={[
        'vs-choice',
        description != null && 'vs-choice--described',
        className
      ].filter(Boolean).join(' ')}
    >
      <input
        {...inputProps}
        ref={inputRef}
        id={inputId}
        type="checkbox"
        className={['vs-checkbox', inputClassName].filter(Boolean).join(' ')}
        aria-labelledby={combineIds(ariaLabelledBy, labelId)}
        aria-describedby={combineIds(ariaDescribedBy, descriptionId)}
      />
      <ChoiceCopy
        label={label}
        labelId={labelId}
        description={description}
        descriptionId={descriptionId}
      />
    </label>
  );
}

export interface CheckboxGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'onChange'
> {
  options: readonly CheckboxGroupOption[];
  legend?: ReactNode;
  description?: ReactNode;
  name?: string;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onChange?: (value: string[]) => void;
}

export function CheckboxGroup({
  options,
  legend,
  description,
  name,
  value,
  defaultValue = [],
  onChange,
  disabled,
  className,
  id,
  'aria-describedby': ariaDescribedBy,
  ...fieldsetProps
}: CheckboxGroupProps) {
  const generatedId = useId();
  const descriptionId = description == null ? undefined : `${generatedId}-description`;
  const [uncontrolledValue, setUncontrolledValue] = useState<readonly string[]>(defaultValue);
  const selectedValues = value ?? uncontrolledValue;

  const updateValue = (optionValue: string, checked: boolean) => {
    const nextValues = new Set(selectedValues);
    if (checked) nextValues.add(optionValue);
    else nextValues.delete(optionValue);
    const next = Array.from(nextValues);

    if (value === undefined) setUncontrolledValue(next);
    onChange?.(next);
  };

  return (
    <fieldset
      {...fieldsetProps}
      id={id}
      className={['vs-selection-group', className].filter(Boolean).join(' ')}
      disabled={disabled}
      aria-describedby={combineIds(ariaDescribedBy, descriptionId)}
    >
      {legend != null && <legend className="vs-selection-group__legend">{legend}</legend>}
      {description != null && (
        <p className="vs-selection-group__description" id={descriptionId}>
          {description}
        </p>
      )}
      <div className="vs-selection-group__options">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            checked={selectedValues.includes(option.value)}
            onChange={(event) => updateValue(option.value, event.currentTarget.checked)}
          />
        ))}
      </div>
    </fieldset>
  );
}

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> {
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
  inputClassName?: string;
}

export function Radio({
  label,
  description,
  className,
  inputClassName,
  id,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: RadioProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = label == null ? undefined : `${inputId}-label`;
  const descriptionId = description == null ? undefined : `${inputId}-description`;

  return (
    <label
      className={[
        'vs-choice',
        description != null && 'vs-choice--described',
        className
      ].filter(Boolean).join(' ')}
    >
      <input
        {...inputProps}
        id={inputId}
        type="radio"
        className={['vs-radio', inputClassName].filter(Boolean).join(' ')}
        aria-labelledby={combineIds(ariaLabelledBy, labelId)}
        aria-describedby={combineIds(ariaDescribedBy, descriptionId)}
      />
      <ChoiceCopy
        label={label}
        labelId={labelId}
        description={description}
        descriptionId={descriptionId}
      />
    </label>
  );
}

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'onChange'
> {
  options: readonly RadioGroupOption[];
  legend?: ReactNode;
  description?: ReactNode;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function RadioGroup({
  options,
  legend,
  description,
  name,
  value,
  defaultValue,
  onChange,
  disabled,
  className,
  id,
  'aria-describedby': ariaDescribedBy,
  ...fieldsetProps
}: RadioGroupProps) {
  const generatedId = useId();
  const descriptionId = description == null ? undefined : `${generatedId}-description`;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selectedValue = value ?? uncontrolledValue;
  const groupName = name ?? generatedId;

  const updateValue = (nextValue: string) => {
    if (value === undefined) setUncontrolledValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <fieldset
      {...fieldsetProps}
      id={id}
      className={['vs-selection-group', className].filter(Boolean).join(' ')}
      disabled={disabled}
      aria-describedby={combineIds(ariaDescribedBy, descriptionId)}
    >
      {legend != null && <legend className="vs-selection-group__legend">{legend}</legend>}
      {description != null && (
        <p className="vs-selection-group__description" id={descriptionId}>
          {description}
        </p>
      )}
      <div className="vs-selection-group__options">
        {options.map((option) => (
          <Radio
            key={option.value}
            name={groupName}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            checked={selectedValue === option.value}
            onChange={() => updateValue(option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> {
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
  switchClassName?: string;
}

export function Switch({
  label,
  description,
  className,
  switchClassName,
  id,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = label == null ? undefined : `${inputId}-label`;
  const descriptionId = description == null ? undefined : `${inputId}-description`;

  return (
    <label
      className={[
        'vs-switch-control',
        (label != null || description != null) && 'vs-switch-control--labeled',
        description != null && 'vs-switch-control--described',
        className
      ].filter(Boolean).join(' ')}
    >
      <ChoiceCopy
        label={label}
        labelId={labelId}
        description={description}
        descriptionId={descriptionId}
      />
      <span className={['vs-switch', switchClassName].filter(Boolean).join(' ')}>
        <input
          {...inputProps}
          id={inputId}
          type="checkbox"
          role="switch"
          aria-labelledby={combineIds(ariaLabelledBy, labelId)}
          aria-describedby={combineIds(ariaDescribedBy, descriptionId)}
        />
        <span className="vs-switch-track" aria-hidden="true" />
      </span>
    </label>
  );
}
