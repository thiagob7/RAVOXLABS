import React from "react";
import { IoCloseSharp } from "react-icons/io5";

interface ModalButtonCloseProps {
  onClick: () => void;
}

export const ModalButtonClose: React.FC<ModalButtonCloseProps> = ({
  onClick,
}) => {
  return (
    <button
      type="button"
      aria-label="Fechar"
      onClick={onClick}
      className="block text-white hover:bg-gray-700 hover:text-red-400 duration-300 absolute right-3 top-3 p-1 rounded-md cursor-pointer"
    >
      <IoCloseSharp size={24} />
    </button>
  );
};
