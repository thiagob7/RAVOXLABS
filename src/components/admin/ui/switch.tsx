"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-gray-700 bg-gray-900/80 p-0.5 outline-none transition-[background-color,border-color,box-shadow] focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 rounded-full bg-gray-300 shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-white data-[state=unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
