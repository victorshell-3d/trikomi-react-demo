import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FocusEvent,
  type FormEvent,
  type HTMLAttributes
} from 'react';
import { Icon } from '../foundation/Icon';
import { useFormFieldContext } from './FormField';

function mergeIds(...ids: Array<string | undefined>) {
  return Array.from(new Set(ids.filter(Boolean))).join(' ') || undefined;
}

function fileMatchesAccept(file: File, accept: string) {
  const patterns = accept
    .split(',')
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean);

  if (patterns.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) return fileName.endsWith(pattern);
    if (pattern.endsWith('/*')) return fileType.startsWith(pattern.slice(0, -1));
    return fileType === pattern;
  });
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function describeAccept(accept: string) {
  return accept
    .split(',')
    .map((pattern) => pattern.trim().toUpperCase())
    .filter(Boolean)
    .join(', ');
}

export interface UploadDropzoneProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop' | 'onError'
> {
  label?: string;
  description?: string;
  accept?: string;
  maxSize?: number;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  value?: File | null;
  defaultValue?: File | null;
  onFileChange?: (file: File | null) => void;
  onError?: (message: string | null) => void;
  onDragEnter?: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: DragEvent<HTMLDivElement>) => void;
}

export function UploadDropzone({
  label = 'Drop 3D Mesh or Texture Here',
  description,
  accept,
  maxSize,
  name,
  required,
  disabled,
  value,
  defaultValue = null,
  onFileChange,
  onError,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  id,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}: UploadDropzoneProps) {
  const generatedId = useId();
  const field = useFormFieldContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledFile, setUncontrolledFile] = useState<File | null>(defaultValue);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dropzoneId = id ?? field?.controlId ?? `vs-upload-${generatedId}`;
  const descriptionId = `${dropzoneId}-description`;
  const errorId = `${dropzoneId}-upload-error`;
  const fileInfoId = `${dropzoneId}-file-info`;
  const currentFile = value === undefined ? uncontrolledFile : value;
  const isRequired = Boolean(required || field?.required);
  const isDisabled = Boolean(disabled || field?.disabled);
  const hasError = Boolean(validationError || field?.hasError);
  const descriptionText = description
    ?? (accept
      ? `Supports ${describeAccept(accept)}`
      : 'Supports .GLB, .USDZ, .OBJ, .PNG');
  const describedBy = mergeIds(
    ariaDescribedBy,
    field?.describedBy,
    descriptionText ? descriptionId : undefined,
    currentFile ? fileInfoId : undefined,
    validationError ? errorId : undefined
  );

  const updateFile = (file: File | null) => {
    setValidationError(null);
    onError?.(null);
    if (value === undefined) setUncontrolledFile(file);
    onFileChange?.(file);
    field?.onChange(file?.name ?? '', 'file');
  };

  const selectFile = (file: File) => {
    if (accept && !fileMatchesAccept(file, accept)) {
      const message = `Choose a file matching ${describeAccept(accept)}.`;
      setValidationError(message);
      onError?.(message);
      return;
    }

    if (maxSize != null && file.size > maxSize) {
      const message = `File must be no larger than ${formatFileSize(maxSize)}.`;
      setValidationError(message);
      onError?.(message);
      return;
    }

    updateFile(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (file) selectFile(file);
  };

  const handleInputBlur = (_event: FocusEvent<HTMLInputElement>) => {
    field?.onBlur(currentFile?.name ?? '', 'file');
  };

  const handleInputInvalid = (_event: FormEvent<HTMLInputElement>) => {
    field?.onBlur(currentFile?.name ?? '', 'file');
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDisabled) setIsDragging(true);
    onDragEnter?.(event);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDisabled) setIsDragging(true);
    onDragOver?.(event);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
    setIsDragging(false);
    onDragLeave?.(event);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!isDisabled) {
      const file = event.dataTransfer.files[0];
      if (file) selectFile(file);
    }
    onDrop?.(event);
  };

  const handleRemove = () => {
    updateFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      {...props}
      className={[
        'vs-upload-dropzone',
        isDragging && 'is-dragging',
        isDisabled && 'is-disabled',
        hasError && 'is-error-state',
        className
      ].filter(Boolean).join(' ')}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        id={dropzoneId}
        className="vs-upload-file-input"
        type="file"
        name={name}
        accept={accept}
        required={isRequired}
        disabled={isDisabled}
        aria-invalid={hasError || undefined}
        aria-errormessage={field?.errorId ?? (validationError ? errorId : undefined)}
        aria-label={ariaLabel}
        aria-labelledby={field?.labelId}
        aria-describedby={describedBy}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onInvalid={handleInputInvalid}
      />
      <label
        htmlFor={dropzoneId}
        className="vs-upload-dropzone__trigger"
      >
        <span className="vs-upload-dropzone__icon" aria-hidden="true">
          <Icon size={16}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </Icon>
        </span>
        <span className="vs-upload-dropzone__title">
          {currentFile ? `Selected: ${currentFile.name}` : label}
        </span>
        {descriptionText && (
          <span id={descriptionId} className="vs-upload-dropzone__description">
            {descriptionText}
          </span>
        )}
      </label>
      {currentFile && (
        <div id={fileInfoId} className="vs-upload-file-info" aria-live="polite">
          <span className="vs-upload-file-info__details">
            <span className="vs-upload-file-info__name">{currentFile.name}</span>
            <span>{formatFileSize(currentFile.size)}{currentFile.type ? ` · ${currentFile.type}` : ''}</span>
          </span>
          <button
            type="button"
            className="vs-upload-file-info__remove"
            disabled={isDisabled}
            aria-label={`Remove ${currentFile.name}`}
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
      )}
      {validationError && (
        <p id={errorId} className="vs-upload-dropzone__error" role="alert">
          {validationError}
        </p>
      )}
    </div>
  );
}
