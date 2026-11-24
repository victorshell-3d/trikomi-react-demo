import { createPortal } from 'react-dom';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import { Button } from '../buttons/Buttons';
import { Icon } from '../foundation/Icon';

export type DropdownMode = 'action' | 'single' | 'multiple';
export type DropdownTriggerVariant = 'primary' | 'glass' | 'outline';

export interface DropdownOption {
  value: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownGroup {
  label?: string;
  dividerBefore?: boolean;
  options: readonly DropdownOption[];
}

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  label: string;
  groups: readonly DropdownGroup[];
  mode?: DropdownMode;
  variant?: DropdownTriggerVariant;
  align?: 'left' | 'right';
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  triggerContent?: ReactNode;
  menuHeader?: ReactNode;
  menuLabel?: string;
  selectionPrefix?: string;
  value?: string;
  defaultValue?: string;
  values?: readonly string[];
  defaultValues?: readonly string[];
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  portalContainer?: Element | null;
  onSelect?: (option: DropdownOption) => void;
  onValueChange?: (value: string, option: DropdownOption) => void;
  onValuesChange?: (values: string[]) => void;
  onOpenChange?: (open: boolean) => void;
}

interface PortalPosition {
  top: number;
  left: number;
  above: boolean;
}

export function Dropdown({
  label,
  groups,
  mode = 'action',
  variant = 'glass',
  align = 'left',
  fullWidth = false,
  leadingIcon,
  triggerContent,
  menuHeader,
  menuLabel,
  selectionPrefix,
  value,
  defaultValue,
  values,
  defaultValues = [],
  open,
  defaultOpen = false,
  disabled = false,
  portalContainer,
  onSelect,
  onValueChange,
  onValuesChange,
  onOpenChange,
  className,
  onBlurCapture,
  ...rootProps
}: DropdownProps) {
  const generatedId = useId();
  const menuId = `vs-dropdown-menu-${generatedId}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const focusLastItem = useRef(false);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledValues, setUncontrolledValues] = useState<string[]>(() => [...defaultValues]);
  const [portalPosition, setPortalPosition] = useState<PortalPosition | null>(null);
  const isOpen = open ?? uncontrolledOpen;
  const selectedValue = value ?? uncontrolledValue;
  const selectedValues = values ?? uncontrolledValues;
  const options = groups.flatMap((group) => group.options);
  const selectedOption = mode === 'single'
    ? options.find((option) => option.value === selectedValue)
    : undefined;

  const updateOpen = useCallback((nextOpen: boolean, returnFocus = false) => {
    if (disabled && nextOpen) return;
    if (nextOpen === isOpen) {
      if (!nextOpen && returnFocus) {
        rootRef.current?.querySelector<HTMLButtonElement>('.vs-dropdown-trigger')?.focus();
      }
      return;
    }
    if (open === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen && returnFocus) {
      rootRef.current?.querySelector<HTMLButtonElement>('.vs-dropdown-trigger')?.focus();
    }
  }, [disabled, isOpen, onOpenChange, open]);

  const focusMenuItem = useCallback((last = false) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role^="menuitem"]:not(:disabled)'
      ) ?? []
    );
    const item = last ? items[items.length - 1] : items[0];
    item?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = window.setTimeout(() => {
      focusMenuItem(focusLastItem.current);
      focusLastItem.current = false;
    }, 0);
    return () => window.clearTimeout(focusTimer);
  }, [isOpen, focusMenuItem]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      updateOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen, updateOpen]);

  useEffect(() => {
    if (!disabled || !isOpen) return;
    updateOpen(false);
  }, [disabled, isOpen, updateOpen]);

  useEffect(() => {
    if (!portalContainer || !isOpen) {
      setPortalPosition(null);
      return;
    }

    const updatePosition = () => {
      const trigger = rootRef.current?.querySelector<HTMLButtonElement>('.vs-dropdown-trigger');
      const menu = menuRef.current;
      if (!trigger || !menu) return;

      const triggerRect = trigger.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const margin = 8;
      let left = align === 'right'
        ? triggerRect.right - menuRect.width
        : triggerRect.left;
      left = Math.max(margin, Math.min(left, window.innerWidth - menuRect.width - margin));

      let top = triggerRect.bottom + 10;
      let above = false;
      if (
        top + menuRect.height > window.innerHeight - margin
        && triggerRect.top > menuRect.height + 10
      ) {
        top = triggerRect.top - menuRect.height - 10;
        above = true;
      }

      setPortalPosition({ top, left, above });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [portalContainer, isOpen, align, groups, menuHeader]);

  const handleFocusExit = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    const nextTarget = event.relatedTarget;
    if (
      nextTarget instanceof Node
      && (rootRef.current?.contains(nextTarget) || menuRef.current?.contains(nextTarget))
    ) {
      return;
    }
    updateOpen(false);
  };

  const handleRootBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    onBlurCapture?.(event);
    handleFocusExit(event);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const last = event.key === 'ArrowUp';
      focusLastItem.current = last;
      if (isOpen) {
        focusMenuItem(last);
      } else {
        updateOpen(true);
      }
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      updateOpen(false, true);
    }
  };

  const handleTriggerClick = () => {
    const nextOpen = !isOpen;
    if (nextOpen) {
      focusLastItem.current = false;
    }
    updateOpen(nextOpen);
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      updateOpen(false, true);
      return;
    }

    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role^="menuitem"]:not(:disabled)'
      ) ?? []
    );
    if (items.length === 0) return;

    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex: number | undefined;
    if (event.key === 'ArrowDown') {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = items.length - 1;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      items[nextIndex]?.focus();
    }
  };

  const handleOptionSelect = (option: DropdownOption) => {
    if (option.disabled || disabled) return;
    onSelect?.(option);

    if (mode === 'single') {
      if (value === undefined) setUncontrolledValue(option.value);
      onValueChange?.(option.value, option);
      updateOpen(false, true);
    } else if (mode === 'multiple') {
      const nextValues = selectedValues.includes(option.value)
        ? selectedValues.filter((selected) => selected !== option.value)
        : [...selectedValues, option.value];
      if (values === undefined) setUncontrolledValues(nextValues);
      onValuesChange?.(nextValues);
    } else {
      updateOpen(false, true);
    }
  };

  const rootClassName = [
    'vs-dropdown',
    fullWidth && 'vs-dropdown--full',
    isOpen && 'is-open',
    className
  ].filter(Boolean).join(' ');
  const visibleTrigger = triggerContent
    ?? (mode === 'single' && selectedOption
      ? `${selectionPrefix ?? ''}${selectedOption.label}`
      : label);

  const menuElement = (
    <div
      ref={menuRef}
      id={menuId}
      className={[
        'vs-dropdown-menu',
        align === 'right' && 'is-right',
        portalContainer && isOpen && 'vs-dropdown-menu--portal',
        portalPosition?.above && 'is-above',
        isOpen && 'is-open'
      ].filter(Boolean).join(' ')}
      role="menu"
      aria-label={menuLabel ?? label}
      aria-hidden={!isOpen}
      aria-orientation="vertical"
      onBlurCapture={handleFocusExit}
      onKeyDown={handleMenuKeyDown}
      style={portalContainer && isOpen
        ? {
          top: portalPosition?.top ?? 0,
          left: portalPosition?.left ?? 0,
          visibility: portalPosition ? undefined : 'hidden'
        }
        : undefined}
    >
      {menuHeader && (
        <div className="vs-dropdown-menu__header-content" role="presentation">
          {menuHeader}
        </div>
      )}
      {groups.map((group, groupIndex) => (
        <div
          key={`${group.label ?? 'group'}-${groupIndex}`}
          className="vs-dropdown-group"
          role="group"
          aria-label={group.label}
        >
          {(group.dividerBefore || groupIndex > 0) && (
            <div className="vs-dd-divider" role="separator" />
          )}
          {group.label && <div className="vs-dd-header">{group.label}</div>}
          {group.options.map((option) => {
            const isSelected = mode === 'single'
              ? option.value === selectedValue
              : mode === 'multiple' && selectedValues.includes(option.value);
            const itemRole = mode === 'single'
              ? 'menuitemradio'
              : mode === 'multiple'
                ? 'menuitemcheckbox'
                : 'menuitem';

            return (
              <button
                key={option.value}
                type="button"
                role={itemRole}
                tabIndex={-1}
                className={[
                  'vs-dd-item',
                  isSelected && 'is-selected',
                  option.danger && 'is-danger'
                ].filter(Boolean).join(' ')}
                disabled={option.disabled}
                aria-disabled={option.disabled || undefined}
                aria-checked={mode === 'action' ? undefined : isSelected}
                onClick={() => handleOptionSelect(option)}
              >
                <span>{option.label}</span>
                {option.shortcut && (
                  <kbd className="vs-dd-kbd">{option.shortcut}</kbd>
                )}
                {mode === 'single' && isSelected && (
                  <span className="vs-dd-check" aria-hidden="true">✓</span>
                )}
                {mode === 'multiple' && (
                  <span
                    className={[
                      'vs-dropdown-check',
                      isSelected && 'is-checked'
                    ].filter(Boolean).join(' ')}
                    aria-hidden="true"
                  >
                    {isSelected && '✓'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderedMenu = portalContainer && isOpen
    ? createPortal(menuElement, portalContainer)
    : menuElement;

  return (
    <div
      {...rootProps}
      ref={rootRef}
      className={rootClassName}
      onBlurCapture={handleRootBlur}
    >
      <Button
        variant={variant}
        className="vs-dropdown-trigger"
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="vs-dropdown-trigger__content">
          {leadingIcon && (
            <span className="vs-dropdown-trigger__icon" aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          <span className="vs-dropdown-trigger__label">{visibleTrigger}</span>
          {mode === 'multiple' && (
            <span className="vs-dropdown-count" aria-label={`${selectedValues.length} selected`}>
              {selectedValues.length}
            </span>
          )}
        </span>
        <Icon className="vs-dd-chevron" size={14} aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </Icon>
      </Button>
      {renderedMenu}
    </div>
  );
}
