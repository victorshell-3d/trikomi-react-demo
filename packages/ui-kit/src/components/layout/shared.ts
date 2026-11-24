import type { CSSProperties } from 'react';

export type LayoutBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
export type Responsive<T extends string | number> =
  | T
  | Partial<Record<LayoutBreakpoint, T>>;
export type LayoutSpace = string | number;

export type LayoutStyle = CSSProperties & {
  [key: `--vs-${string}`]: string | number | undefined;
};

const breakpoints: LayoutBreakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];

export function cssLength(value: LayoutSpace): string {
  return typeof value === 'number' ? `${value}px` : value;
}

export function responsiveVariables<T extends string | number>(
  name: string,
  value: Responsive<T> | undefined,
  format: (value: T) => string = String
): LayoutStyle {
  const styles: LayoutStyle = {};
  if (value === undefined) return styles;

  const values = typeof value === 'object' ? value : { base: value };
  for (const breakpoint of breakpoints) {
    const breakpointValue = values[breakpoint];
    if (breakpointValue !== undefined) {
      styles[`--vs-${name}-${breakpoint}`] = format(breakpointValue);
    }
  }

  return styles;
}
