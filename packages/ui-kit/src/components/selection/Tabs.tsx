import {
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from 'react';

export interface TabOption {
  value: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  label: string;
  options: readonly TabOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

function nextIndex(currentIndex: number, key: string, count: number) {
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return key === 'ArrowRight'
    ? (currentIndex + 1) % count
    : (currentIndex - 1 + count) % count;
}

export function Tabs({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  className,
  ...rootProps
}: TabsProps) {
  const generatedId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstValue = options[0]?.value;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? firstValue);
  const activeValue = value ?? uncontrolledValue;
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === activeValue));

  const selectValue = (nextValue: string) => {
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || options.length === 0) return;
    event.preventDefault();
    const targetIndex = nextIndex(index, event.key, options.length);
    tabRefs.current[targetIndex]?.focus();
    selectValue(options[targetIndex].value);
  };

  return (
    <div {...rootProps} className={['vs-tabs', className].filter(Boolean).join(' ')}>
      <div
        className="vs-tab-track vs-tabs__list"
        role="tablist"
        aria-label={label}
      >
        {options.map((option, index) => {
          const selected = index === selectedIndex;
          const tabId = `${generatedId}-tab-${index}`;
          const panelId = `${generatedId}-panel-${index}`;

          return (
            <button
              key={option.value}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={tabId}
              className={['vs-tab-pill', selected && 'is-active'].filter(Boolean).join(' ')}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectValue(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      {options.map((option, index) => (
        <div
          key={option.value}
          id={`${generatedId}-panel-${index}`}
          className="vs-tabs__panel"
          role="tabpanel"
          aria-labelledby={`${generatedId}-tab-${index}`}
          tabIndex={0}
          hidden={index !== selectedIndex}
        >
          {option.content}
        </div>
      ))}
    </div>
  );
}

export interface SegmentedControlOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  label: string;
  options: readonly SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function SegmentedControl({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  className,
  ...rootProps
}: SegmentedControlProps) {
  const generatedId = useId();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
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
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || options.length === 0) return;
    event.preventDefault();
    const targetIndex = nextIndex(index, event.key, options.length);
    buttonRefs.current[targetIndex]?.focus();
    selectValue(options[targetIndex].value);
  };

  return (
    <div
      {...rootProps}
      className={['vs-tab-track', 'vs-segmented-control', className].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option, index) => {
        const selected = option.value === selectedValue;

        return (
          <button
            key={option.value}
            ref={(element) => { buttonRefs.current[index] = element; }}
            id={`${generatedId}-option-${index}`}
            className={['vs-tab-pill', selected && 'is-active'].filter(Boolean).join(' ')}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => selectValue(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
