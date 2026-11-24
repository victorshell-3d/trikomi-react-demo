import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent
} from 'react';

export interface MaterialSwatchOption {
  value: string;
  label: string;
  background: CSSProperties['background'];
  boxShadow?: CSSProperties['boxShadow'];
  border?: CSSProperties['border'];
}

export interface MaterialSwatchGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
  | 'onSelect'
> {
  title: string;
  options: readonly MaterialSwatchOption[];
  value?: string;
  defaultValue?: string;
  onSelect?: (option: MaterialSwatchOption) => void;
}

export function MaterialSwatchGroup({
  title,
  options,
  value,
  defaultValue,
  onSelect,
  className,
  ...rootProps
}: MaterialSwatchGroupProps) {
  const generatedId = useId();
  const swatchRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstValue = options[0]?.value;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? firstValue);
  const requestedValue = value ?? uncontrolledValue;
  const selectedValue = options.some((option) => option.value === requestedValue)
    ? requestedValue
    : firstValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

  const selectOption = (option: MaterialSwatchOption) => {
    if (value === undefined) setUncontrolledValue(option.value);
    onSelect?.(option);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const key = event.key;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key) || options.length === 0) return;
    event.preventDefault();
    const targetIndex = key === 'Home'
      ? 0
      : key === 'End'
        ? options.length - 1
        : key === 'ArrowRight' || key === 'ArrowDown'
          ? (index + 1) % options.length
          : (index - 1 + options.length) % options.length;
    const option = options[targetIndex];
    swatchRefs.current[targetIndex]?.focus();
    selectOption(option);
  };

  return (
    <div
      {...rootProps}
      className={['vs-material-picker', className].filter(Boolean).join(' ')}
    >
      <div className="vs-material-picker__header">
        <span id={`${generatedId}-title`} className="vs-material-picker__title">
          {title}
        </span>
        <span className="vs-material-picker__active" aria-live="polite">
          Active: {selectedOption?.label ?? '—'}
        </span>
      </div>
      <div
        className="vs-material-swatch-grid"
        role="radiogroup"
        aria-labelledby={`${generatedId}-title`}
      >
        {options.map((option, index) => {
          const selected = option.value === selectedValue;

          return (
            <button
              key={option.value}
              ref={(element) => { swatchRefs.current[index] = element; }}
              className={[
                'vs-swatch-card',
                selected && 'is-selected'
              ].filter(Boolean).join(' ')}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectOption(option)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span
                className="vs-orb"
                aria-hidden="true"
                style={{
                  background: option.background,
                  boxShadow: option.boxShadow,
                  border: option.border
                }}
              />
              <span className="vs-swatch-name">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
