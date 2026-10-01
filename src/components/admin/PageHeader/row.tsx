import React, { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface RowProps extends HTMLAttributes<HTMLDivElement> {}

export const Row: React.FC<RowProps> = ({ children, className }) => {
  return <div className={twMerge("flex flex-row", className)}>{children}</div>;
};
