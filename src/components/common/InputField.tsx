import * as React from "react";

import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface InputFieldProps extends InputProps {
  label: string;
  required?: boolean;
  error?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, required, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-blue-500 ml-1">*</span>}
        </Label>
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          required={required}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);
InputField.displayName = "InputField";

export { InputField };
