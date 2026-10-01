import React from "react";
import { IoChevronForward } from "react-icons/io5";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface NextButtonProps {
  onClick?: React.MouseEventHandler<Element> | undefined;
  disabled?: boolean;
  className?: ClassNameValue;
}

export const NextButton: React.FC<NextButtonProps> = ({
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
      <IoChevronForward size={24} />
    </button>
  );
};
