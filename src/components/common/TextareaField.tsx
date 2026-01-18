import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ className, label, required, error, id, ...props }, ref) => {
    const textareaId = id || React.useId();

    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={textareaId}>
          {label}
          {required && <span className="text-blue-500 ml-1">*</span>}
        </Label>
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "flex min-h-[120px] w-full rounded-xl bg-gray-900 border border-gray-600 px-4 py-3 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none",
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
TextareaField.displayName = "TextareaField";

export { TextareaField };
