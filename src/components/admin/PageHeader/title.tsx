import React from "react";
import { twMerge } from "tailwind-merge";

interface TitleProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Title: React.FC<TitleProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <span
      {...rest}
      className={twMerge("text-xl font-semibold text-white", className)}
    >
      {children}
    </span>
  );
};
