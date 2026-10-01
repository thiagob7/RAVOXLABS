import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

import {
  fieldControlClassName,
  fieldErrorClassName,
  fieldHintClassName,
  fieldLabelClassName,
  fieldRootClassName,
} from "./field-layout";

interface FieldProps {
  label?: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn(fieldRootClassName, className)}>
      {label && (
        <label htmlFor={htmlFor} className={fieldLabelClassName}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className={fieldErrorClassName}>{error}</p>
      ) : (
        hint && <p className={fieldHintClassName}>{hint}</p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: ReactNode;
  error?: string;
  containerClassName?: string;
};

export function Input({
  label,
  hint,
  error,
  id,
  name,
  className,
  containerClassName,
  ...props
}: InputProps) {
  const inputId = id ?? name;
  return (
    <Field
      label={label}
      htmlFor={inputId}
      hint={hint}
      error={error}
      className={containerClassName}
    >
      <input
        id={inputId}
        name={name}
        aria-invalid={Boolean(error)}
        {...props}
        className={cn(
          fieldControlClassName,
          "h-10",
          props.type === "number" &&
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          className
        )}
      />
    </Field>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: ReactNode;
  error?: string;
  containerClassName?: string;
};

export function Textarea({
  label,
  hint,
  error,
  id,
  name,
  className,
  containerClassName,
  ...props
}: TextareaProps) {
  const inputId = id ?? name;
  return (
    <Field
      label={label}
      htmlFor={inputId}
      hint={hint}
      error={error}
      className={containerClassName}
    >
      <textarea
        id={inputId}
        name={name}
        aria-invalid={Boolean(error)}
        {...props}
        className={cn(
          fieldControlClassName,
          "min-h-28 resize-y py-3",
          className
        )}
      />
    </Field>
  );
}
