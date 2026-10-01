import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface ModalHeaderProps extends PropsWithChildren {
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-col border-b pt-4 border-gray-700 pb-4 bg-gray-850 z-4 mx-4",
        className
      )}
    >
      {children}
    </div>
  );
};
