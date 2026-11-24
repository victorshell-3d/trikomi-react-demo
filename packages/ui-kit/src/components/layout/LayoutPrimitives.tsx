import type {
  CSSProperties,
  HTMLAttributes
} from 'react';
import {
  cssLength,
  responsiveVariables,
  type LayoutSpace,
  type LayoutStyle,
  type Responsive
} from './shared';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: Responsive<number>;
  gap?: Responsive<LayoutSpace>;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyItems'];
}

function assertPositiveInteger(value: number, propName: string) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${propName} values must be positive integers.`);
  }
}

export function Grid({
  columns = 1,
  gap = 'var(--vs-space-6)',
  align,
  justify,
  className,
  style,
  ...props
}: GridProps) {
  const rootClassName = ['vs-layout-grid', className].filter(Boolean).join(' ');
  const rootStyle: LayoutStyle = {
    ...responsiveVariables('layout-grid-columns', columns, (value) => {
      assertPositiveInteger(value, 'Grid columns');
      return String(value);
    }),
    ...responsiveVariables('layout-grid-gap', gap, cssLength),
    alignItems: align,
    justifyItems: justify,
    ...style
  };

  return <div {...props} className={rootClassName} style={rootStyle} />;
}

export type GridItemSpan = number | 'full';

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: Responsive<GridItemSpan>;
}

export function GridItem({
  span,
  className,
  style,
  ...props
}: GridItemProps) {
  const rootClassName = ['vs-layout-grid-item', className].filter(Boolean).join(' ');
  const rootStyle: LayoutStyle = {
    ...responsiveVariables('layout-grid-item-span', span, (value) => {
      if (value === 'full') return '1 / -1';
      assertPositiveInteger(value, 'Grid item span');
      return `span ${value}`;
    }),
    ...style
  };

  return <div {...props} className={rootClassName} style={rootStyle} />;
}

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: Responsive<FlexDirection>;
  gap?: Responsive<LayoutSpace>;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: CSSProperties['flexWrap'];
}

export function Flex({
  direction = 'row',
  gap = 'var(--vs-space-4)',
  align,
  justify,
  wrap = 'nowrap',
  className,
  style,
  ...props
}: FlexProps) {
  const rootClassName = ['vs-layout-flex', className].filter(Boolean).join(' ');
  const rootStyle: LayoutStyle = {
    ...responsiveVariables('layout-flex-direction', direction),
    ...responsiveVariables('layout-flex-gap', gap, cssLength),
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    ...style
  };

  return <div {...props} className={rootClassName} style={rootStyle} />;
}

export type StackProps = Omit<FlexProps, 'direction' | 'wrap'>;

export function Stack({
  gap = 'var(--vs-space-4)',
  ...props
}: StackProps) {
  return <Flex {...props} direction="column" gap={gap} />;
}

export type InlineProps = Omit<FlexProps, 'direction'>;

export function Inline({
  gap = 'var(--vs-space-3)',
  align = 'center',
  wrap = 'wrap',
  ...props
}: InlineProps) {
  return (
    <Flex
      {...props}
      direction="row"
      gap={gap}
      align={align}
      wrap={wrap}
    />
  );
}

export interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  size?: LayoutSpace;
  flexible?: boolean;
}

export function Spacer({
  orientation = 'horizontal',
  size,
  flexible = true,
  className,
  style,
  ...props
}: SpacerProps) {
  const rootClassName = [
    'vs-layout-spacer',
    `vs-layout-spacer--${orientation}`,
    className
  ].filter(Boolean).join(' ');
  const rootStyle: CSSProperties = {
    flex: flexible ? '1 1 auto' : '0 0 auto',
    ...(size !== undefined && orientation === 'horizontal'
      ? { width: cssLength(size) }
      : {}),
    ...(size !== undefined && orientation === 'vertical'
      ? { height: cssLength(size) }
      : {}),
    ...style
  };

  return (
    <div
      {...props}
      className={rootClassName}
      style={rootStyle}
      aria-hidden="true"
    />
  );
}
