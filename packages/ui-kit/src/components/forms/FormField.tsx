import {
  createContext,
  useContext,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import { Label } from '../foundation/Typography';

export type ValidationLimit = number | {
  value: number;
  message?: string;
};

export interface FormFieldRules {
  required?: boolean | string;
  email?: boolean | string;
  minLength?: ValidationLimit;
  maxLength?: ValidationLimit;
  min?: ValidationLimit;
  max?: ValidationLimit;
}

interface FormFieldContextValue {
  controlId: string;
  labelId: string;
  describedBy?: string;
  errorId?: string;
  required: boolean;
  disabled: boolean;
  hasError: boolean;
  success: boolean;
  rules: FormFieldRules;
  onChange: (value: string, type: string) => void;
  onBlur: (value: string, type: string) => void;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export function useFormFieldContext() {
  return useContext(FormFieldContext);
}

function getLimit(limit: ValidationLimit | undefined) {
  if (limit == null) return undefined;
  return typeof limit === 'number' ? { value: limit } : limit;
}

function getMessage(rule: boolean | string | undefined, fallback: string) {
  return typeof rule === 'string' ? rule : fallback;
}

export function validateFieldValue(value: string, rules: FormFieldRules): string | undefined {
  const trimmedValue = value.trim();
  if (rules.required && trimmedValue.length === 0) {
    return getMessage(rules.required, 'This field is required.');
  }

  if (trimmedValue.length === 0) return undefined;

  if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return getMessage(rules.email, 'Enter a valid email address.');
  }

  const length = trimmedValue.length;
  const minLength = getLimit(rules.minLength);
  if (minLength && length < minLength.value) {
    return minLength.message ?? `Enter at least ${minLength.value} characters.`;
  }

  const maxLength = getLimit(rules.maxLength);
  if (maxLength && length > maxLength.value) {
    return maxLength.message ?? `Use no more than ${maxLength.value} characters.`;
  }

  const numericValue = Number(trimmedValue);
  if (Number.isFinite(numericValue)) {
    const min = getLimit(rules.min);
    if (min && numericValue < min.value) {
      return min.message ?? `Enter a value greater than or equal to ${min.value}.`;
    }

    const max = getLimit(rules.max);
    if (max && numericValue > max.value) {
      return max.message ?? `Enter a value less than or equal to ${max.value}.`;
    }
  }

  return undefined;
}

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  label: ReactNode;
  fieldId?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  rules?: FormFieldRules;
  children: ReactNode;
}

export function FormField({
  label,
  fieldId,
  required = false,
  disabled = false,
  helperText,
  error,
  successMessage,
  rules = {},
  className,
  children,
  ...props
}: FormFieldProps) {
  const generatedId = useId();
  const controlId = fieldId ?? `vs-field-${generatedId}`;
  const labelId = `${controlId}-label`;
  const helperId = `${controlId}-helper`;
  const errorId = `${controlId}-error`;
  const successId = `${controlId}-success`;
  const [touched, setTouched] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>();
  const isRequired = required || Boolean(rules.required);
  const hasExternalError = Boolean(error);
  const errorContent = hasExternalError ? error : validationMessage;
  const hasError = Boolean(errorContent);
  const success = !hasError && touched && hasValue && successMessage != null;

  const validate = (value: string, type: string) => validateFieldValue(value, {
    ...rules,
    required: rules.required || (isRequired ? true : undefined),
    email: rules.email ?? type === 'email'
  });

  const handleChange = (value: string, type: string) => {
    setHasValue(value.trim().length > 0);
    if (touched) setValidationMessage(validate(value, type));
  };

  const handleBlur = (value: string, type: string) => {
    setTouched(true);
    setHasValue(value.trim().length > 0);
    setValidationMessage(validate(value, type));
  };

  const describedBy = [
    helperText != null && helperId,
    hasError && errorId,
    success && successId
  ].filter(Boolean).join(' ') || undefined;

  const contextValue: FormFieldContextValue = {
    controlId,
    labelId,
    describedBy,
    errorId: hasError ? errorId : undefined,
    required: isRequired,
    disabled,
    hasError: Boolean(hasError),
    success: Boolean(success),
    rules,
    onChange: handleChange,
    onBlur: handleBlur
  };

  return (
    <div
      {...props}
      className={['vs-form-field', hasError && 'vs-form-field--error', success && 'vs-form-field--success', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="vs-form-field__label-row">
        <Label id={labelId} htmlFor={controlId} className="vs-form-field__label">
          {label}
          {isRequired && <span className="vs-form-field__required" aria-hidden="true"> *</span>}
        </Label>
      </div>
      <FormFieldContext.Provider value={contextValue}>
        {children}
      </FormFieldContext.Provider>
      {helperText != null && (
        <p id={helperId} className="vs-form-field__helper">{helperText}</p>
      )}
      {hasError && (
        <p id={errorId} className="vs-form-field__error" role="alert">{errorContent}</p>
      )}
      {success && (
        <p id={successId} className="vs-form-field__success" role="status">{successMessage}</p>
      )}
    </div>
  );
}
