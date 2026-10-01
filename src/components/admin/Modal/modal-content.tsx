import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface ModalContentProps extends PropsWithChildren {
  className?: string;
}

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className,
}) => {
  return (
    <div
      data-modal-content
      className={twMerge(
        "flex-1 overflow-y-auto overflow-x-hidden p-4",
        className
      )}
    >
      <div className="rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1">
        {children}
      </div>
    </div>
  );
};
