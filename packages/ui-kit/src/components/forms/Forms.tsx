import type { FormHTMLAttributes, HTMLAttributes } from 'react';

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

export function Form({
  className,
  ...props
}: FormProps) {
  return <form {...props} className={['vs-form', className].filter(Boolean).join(' ')} />;
}

export type FormLayoutProps = HTMLAttributes<HTMLDivElement>;

export function FormLayout({
  className,
  ...props
}: FormLayoutProps) {
  return <div {...props} className={['vs-form-layout', className].filter(Boolean).join(' ')} />;
}
