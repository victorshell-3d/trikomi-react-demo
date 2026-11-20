import {
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode
} from 'react';
import { IconButton } from '../buttons/Buttons';
import { Icon } from '../foundation/Icon';
import {
  SegmentedControl,
  type SegmentedControlOption
} from '../selection/Tabs';

export interface ConfiguratorDockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'role'> {
  label: string;
}

export function ConfiguratorDock({
  label,
  className,
  ...props
}: ConfiguratorDockProps) {
  return (
    <div
      {...props}
      className={['vs-floating-dock', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
    />
  );
}

export interface DockItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children' | 'className'
> {
  label: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

export function DockItem({
  label,
  icon,
  trailing,
  className,
  type = 'button',
  ...buttonProps
}: DockItemProps) {
  return (
    <button
      {...buttonProps}
      className={['vs-tab-pill', 'vs-dock-item', className].filter(Boolean).join(' ')}
      type={type}
    >
      {icon}
      <span>{label}</span>
      {trailing}
    </button>
  );
}

export type DockDividerProps = HTMLAttributes<HTMLSpanElement>;

export function DockDivider({ className, ...props }: DockDividerProps) {
  return (
    <span
      {...props}
      className={['vs-dock-divider', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  );
}

export type TourSceneOption = SegmentedControlOption;

export interface TourSceneSwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'role'> {
  label: string;
  options: readonly TourSceneOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function TourSceneSwitcher({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: TourSceneSwitcherProps) {
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

  const moveScene = (direction: -1 | 1) => {
    if (options.length === 0 || selectedValue === undefined) return;
    const currentIndex = options.findIndex((option) => option.value === selectedValue);
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    selectValue(options[nextIndex].value);
  };

  return (
    <div
      {...props}
      className={['vs-tour-scene-switcher', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
    >
      <IconButton
        className="vs-tour-scene-switcher__arrow"
        size="small"
        label="Previous scene"
        onClick={() => moveScene(-1)}
      >
        <Icon size={16}><polyline points="15 18 9 12 15 6" /></Icon>
      </IconButton>
      <SegmentedControl
        className="vs-tour-scene-switcher__scenes"
        label={`${label} scenes`}
        options={options}
        value={selectedValue}
        onValueChange={selectValue}
      />
      <IconButton
        className="vs-tour-scene-switcher__arrow"
        size="small"
        label="Next scene"
        onClick={() => moveScene(1)}
      >
        <Icon size={16}><polyline points="9 18 15 12 9 6" /></Icon>
      </IconButton>
    </div>
  );
}
