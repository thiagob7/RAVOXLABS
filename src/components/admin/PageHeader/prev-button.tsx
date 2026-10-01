import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface PrevButtonProps {
  onClick?: React.MouseEventHandler<Element> | undefined;
  disabled?: boolean;
  className?: ClassNameValue;
}

export const PrevButton: React.FC<PrevButtonProps> = ({
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={twMerge(
        "relative flex h-8 w-8 cursor-pointer items-center justify-center text-white duration-300 before:absolute before:-inset-1 before:content-[''] disabled:cursor-not-allowed disabled:opacity-30 not-disabled:hover:text-blue-500",
        className
      )}
    >
      <IoChevronBack size={24} />
    </button>
  );
};
