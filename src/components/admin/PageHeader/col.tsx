import React, { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ColProps extends HTMLAttributes<HTMLDivElement> {}

export const Col: React.FC<ColProps> = ({ children, className }) => {
  return <div className={twMerge("flex flex-col", className)}>{children}</div>;
};
