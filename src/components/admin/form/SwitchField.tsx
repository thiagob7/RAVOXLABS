"use client";

import { Switch } from "../ui/switch";

interface SwitchFieldProps {
  name: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}

/** Switch do Radix com input oculto: envia "on" no FormData quando ligado. */
export function SwitchField({
  name,
  label,
  description,
  defaultChecked,
}: SwitchFieldProps) {
  return (
    <label
      htmlFor={name}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 transition-colors hover:border-gray-500"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-white">{label}</span>
        <span className="mt-0.5 block text-xs text-gray-500">
          {description}
        </span>
      </span>
      <Switch id={name} name={name} defaultChecked={defaultChecked} />
    </label>
  );
}
