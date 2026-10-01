import React from "react";
import { twMerge } from "tailwind-merge";

interface SubtitleProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Subtitle: React.FC<SubtitleProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <span {...rest} className={twMerge("text-sm text-gray-300", className)}>
      {children}
    </span>
  );
};
