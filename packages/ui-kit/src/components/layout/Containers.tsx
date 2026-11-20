import type { CSSProperties, HTMLAttributes } from 'react';
import {
  cssLength,
  responsiveVariables,
  type LayoutSpace,
  type Responsive
} from './shared';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: CSSProperties['maxWidth'];
  gutter?: Responsive<LayoutSpace>;
}

interface LayoutContainerProps extends ContainerProps {
  containerClass: string;
  defaultMaxWidth: CSSProperties['maxWidth'];
}

function LayoutContainer({
  containerClass,
  defaultMaxWidth,
  maxWidth = defaultMaxWidth,
  gutter = 'var(--vs-space-4)',
  className,
  style,
  ...props
}: LayoutContainerProps) {
  const rootClassName = [
    'vs-layout-container',
    containerClass,
    className
  ].filter(Boolean).join(' ');
  const rootStyle = {
    ...responsiveVariables('layout-container-gutter', gutter, cssLength),
    maxWidth,
    ...style
  };

  return <div {...props} className={rootClassName} style={rootStyle} />;
}

export function PageContainer(props: ContainerProps) {
  return (
    <LayoutContainer
      {...props}
      containerClass="vs-page-container"
      defaultMaxWidth="1440px"
    />
  );
}

export function SectionContainer(props: ContainerProps) {
  return (
    <LayoutContainer
      {...props}
      containerClass="vs-section-container"
      defaultMaxWidth="1440px"
    />
  );
}

export function ContentContainer(props: ContainerProps) {
  return (
    <LayoutContainer
      {...props}
      containerClass="vs-content-container"
      defaultMaxWidth="42rem"
    />
  );
}

export function FluidContainer(props: ContainerProps) {
  return (
    <LayoutContainer
      {...props}
      containerClass="vs-fluid-container"
      defaultMaxWidth="none"
    />
  );
}
