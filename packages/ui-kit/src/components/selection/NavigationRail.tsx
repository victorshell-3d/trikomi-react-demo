import {
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from 'react';

export interface NavigationRailOption {
  value: string;
  label: string;
  icon: ReactNode;
}

export interface NavigationRailProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  label: string;
  options: readonly NavigationRailOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function NavigationRail({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  className,
  ...rootProps
}: NavigationRailProps) {
  const generatedId = useId();
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstValue = options[0]?.value;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? firstValue);
  const requestedValue = value ?? uncontrolledValue;
  const selectedValue = options.some((option) => option.value === requestedValue)
    ? requestedValue
    : firstValue;

  const selectValue = (nextValue: string) => {
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key) || options.length === 0) return;
    event.preventDefault();
    const targetIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? options.length - 1
        : event.key === 'ArrowDown'
          ? (index + 1) % options.length
          : (index - 1 + options.length) % options.length;

    itemRefs.current[targetIndex]?.focus();
    selectValue(options[targetIndex].value);
  };

  return (
    <div
      {...rootProps}
      className={['vs-vertical-rail', className].filter(Boolean).join(' ')}
      role="toolbar"
      aria-label={label}
      aria-orientation="vertical"
    >
      {options.map((option, index) => {
        const selected = option.value === selectedValue;

        return (
          <button
            key={option.value}
            ref={(element) => { itemRefs.current[index] = element; }}
            id={`${generatedId}-item-${index}`}
            className={['vs-rail-item', selected && 'is-active'].filter(Boolean).join(' ')}
            type="button"
            aria-pressed={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => selectValue(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
