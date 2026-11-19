import type {
  HTMLAttributes,
  LabelHTMLAttributes
} from 'react';

export type TextVariant = 'body' | 'small' | 'caption' | 'label' | 'mono';
export type TextTone = 'default' | 'muted' | 'subtle' | 'accent';
export type HeadingVariant = 'display' | 'page' | 'section' | 'subheading';

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  tone?: TextTone;
}

export function Text({
  variant = 'body',
  tone = 'default',
  className,
  children,
  ...props
}: TextProps) {
  const rootClassName = [
    'vs-text',
    `vs-text--${variant}`,
    `vs-text--tone-${tone}`,
    className
  ].filter(Boolean).join(' ');

  return <p {...props} className={rootClassName}>{children}</p>;
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  variant?: HeadingVariant;
  tone?: TextTone;
}

export function Heading({
  level = 2,
  variant,
  tone = 'default',
  className,
  children,
  ...props
}: HeadingProps) {
  const resolvedVariant = variant ?? (
    level === 1 ? 'page' : level === 2 ? 'section' : 'subheading'
  );
  const rootClassName = [
    'vs-heading',
    `vs-heading--${resolvedVariant}`,
    `vs-heading--tone-${tone}`,
    className
  ].filter(Boolean).join(' ');
  const headingProps = { ...props, className: rootClassName };

  switch (level) {
    case 1:
      return <h1 {...headingProps}>{children}</h1>;
    case 2:
      return <h2 {...headingProps}>{children}</h2>;
    case 3:
      return <h3 {...headingProps}>{children}</h3>;
    case 4:
      return <h4 {...headingProps}>{children}</h4>;
  }
}

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  tone?: TextTone;
}

export function Label({
  tone = 'muted',
  className,
  children,
  ...props
}: LabelProps) {
  const rootClassName = [
    'vs-label',
    `vs-label--tone-${tone}`,
    className
  ].filter(Boolean).join(' ');

  return <label {...props} className={rootClassName}>{children}</label>;
}

export interface CaptionProps extends HTMLAttributes<HTMLElement> {
  tone?: TextTone;
}

export function Caption({
  tone = 'muted',
  className,
  children,
  ...props
}: CaptionProps) {
  const rootClassName = [
    'vs-caption',
    `vs-caption--tone-${tone}`,
    className
  ].filter(Boolean).join(' ');

  return <small {...props} className={rootClassName}>{children}</small>;
}
