import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface ModalActionsProps extends PropsWithChildren {
  className?: string;
}

export const ModalActions: React.FC<ModalActionsProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={twMerge(
        "flex gap-4 border-t border-gray-700 p-4 bg-gray-850",
        className
      )}
    >
      {children}
    </div>
  );
};
