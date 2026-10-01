import React, { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import { pageHeaderVariant, PageHeaderVariant } from "./variant";

interface PageHeaderProps
  extends HTMLAttributes<HTMLDivElement>, PageHeaderVariant {}

export const Root: React.FC<PageHeaderProps> = ({
  children,
  className,
  variant,
}) => {
  return (
    <div
      className={pageHeaderVariant({
        variant,
        className: twMerge(
          "w-full min-w-0 flex-wrap gap-4 items-center justify-between",
          className
        ),
      })}
    >
      {children}
    </div>
  );
};
