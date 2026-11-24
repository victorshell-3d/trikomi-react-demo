import type {
  ButtonHTMLAttributes,
  ReactNode
} from 'react';

export type ButtonVariant =
  | 'primary'
  | 'gradient'
  | 'secondary'
  | 'outline'
  | 'glass'
  | 'tonal'
  | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
}

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'vs-btn-primary',
  gradient: 'vs-btn-primary',
  secondary: 'vs-btn-tonal',
  outline: 'vs-btn-outline',
  glass: 'vs-btn-glass',
  tonal: 'vs-btn-tonal',
  ghost: 'vs-btn-ghost'
};

export function Button({
  variant = 'primary',
  size = 'medium',
  active,
  className,
  type = 'button',
  'aria-pressed': ariaPressed,
  ...props
}: ButtonProps) {
  const isActive = active ?? ariaPressed === true;
  const rootClassName = [
    'vs-btn',
    buttonVariantClasses[variant],
    `vs-btn--${size}`,
    isActive && 'is-active-state',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      {...props}
      className={rootClassName}
      type={type}
      aria-pressed={active ?? ariaPressed}
    />
  );
}

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'aria-pressed' | 'children'
> {
  label: string;
  children: ReactNode;
  size?: ButtonSize;
  active?: boolean;
}

export function IconButton({
  label,
  size = 'medium',
  active,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  const rootClassName = [
    'vs-circle-icon',
    `vs-circle-icon--${size}`,
    active && 'is-active',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      {...props}
      className={rootClassName}
      type={type}
      aria-label={label}
      aria-pressed={active}
    />
  );
}
