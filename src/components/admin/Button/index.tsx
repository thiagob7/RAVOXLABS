"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "radix-ui";

import { Spinner } from "../Spinner";
import { buttonVariant, ButtonVariantProps } from "./variant";

interface ButtonProps
  extends ButtonVariantProps, ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant, size, className, disabled, loading, asChild, ...rest },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot.Root
          ref={ref}
          aria-disabled={disabled || loading}
          data-disabled={disabled || loading ? "" : undefined}
          className={buttonVariant({
            variant,
            size,
            className: `relative ${className ?? ""}`,
          })}
          {...rest}
        >
          {children}
        </Slot.Root>
      );
    }

    return (
      <button
        ref={ref}
        {...rest}
        disabled={disabled || loading}
        className={buttonVariant({
          variant,
          size,
          className: `relative ${className ?? ""}`,
        })}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size={18} className="animate-spin text-current" />
          </span>
        )}

        <span
          className={`inline-flex items-center justify-center gap-2 ${
            loading ? "opacity-0" : ""
          }`}
        >
          {children}
        </span>
      </button>
    );
  }
);
