import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  divider?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormSection({
  title,
  description,
  divider,
  className,
  children,
}: FormSectionProps) {
  return (
    <section
      className={cn(divider && "border-t border-gray-700 pt-5", className)}
    >
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}
